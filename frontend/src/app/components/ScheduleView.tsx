import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../utils/supabase";
import { ChevronLeft, ChevronRight, CalendarDays, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

interface Booking {
  booking_time: string;
  hours: number;
  table_name: string;
  customer_name: string;
  guests: number;
}

const TABLE_NAMES = [
  "โต๊ะ 1",
  "โต๊ะ 2",
  "โต๊ะ 3",
  "โต๊ะ 4",
  "โต๊ะ 5",
  "โต๊ะ 6",
];

const HOURS = Array.from({ length: 10 }, (_, i) => i + 14); // 14-23

const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const SHORT_THAI_DAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

function formatDateThai(date: Date): string {
  const day = THAI_DAYS[date.getDay()];
  const d = date.getDate();
  const month = THAI_MONTHS[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `วัน${day}ที่ ${d} ${month} ${year}`;
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

interface ScheduleViewProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export function ScheduleView({ isOpen, onClose, isAdmin }: ScheduleViewProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    // If today is Sunday, go to Monday
    if (today.getDay() === 0) {
      today.setDate(today.getDate() + 1);
    }
    return today;
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const dateStr = toDateString(selectedDate);
  const isSunday = selectedDate.getDay() === 0;

  useEffect(() => {
    if (!isOpen) return;
    fetchBookings();
  }, [isOpen, dateStr]);

  async function fetchBookings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("booking_time, hours, table_name, customer_name, guests")
      .eq("booking_date", dateStr);
    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  }

  // Build a map: tableName -> Set of booked hour indices
  const bookedMap = useMemo(() => {
    const map: Record<string, Map<number, Booking>> = {};
    TABLE_NAMES.forEach((t) => (map[t] = new Map()));

    for (const b of bookings) {
      const startMin = timeToMinutes(b.booking_time);
      const endMin = startMin + b.hours * 60;

      for (const hour of HOURS) {
        const slotStart = hour * 60;
        const slotEnd = slotStart + 60;
        // Overlap check: slot overlaps with booking if slotStart < endMin && slotEnd > startMin
        if (slotStart < endMin && slotEnd > startMin) {
          if (map[b.table_name]) {
            map[b.table_name].set(hour, b);
          }
        }
      }
    }
    return map;
  }, [bookings]);

  const todayStr = toDateString(new Date());

  function changeDate(delta: number) {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + delta);
      // Skip Sunday
      if (next.getDay() === 0) {
        next.setDate(next.getDate() + (delta > 0 ? 1 : -1));
      }
      // Non-admin: block going before today
      if (!isAdmin && toDateString(next) < todayStr) {
        return prev;
      }
      return next;
    });
  }

  const canGoBack = isAdmin || toDateString(selectedDate) > todayStr;

  // Generate week dates for the week strip
  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    // Start from 3 days before selected date
    for (let i = -3; i <= 3; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [selectedDate]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden [&>button]:text-muted-foreground [&>button]:hover:text-foreground [&>button]:top-4 [&>button]:right-6">
        {/* Header */}
        <DialogHeader className="bg-muted px-6 py-4 flex-row items-center space-y-0 border-b border-border">
          <DialogTitle className="flex items-center gap-3 text-foreground text-xl">
            <CalendarDays className="w-6 h-6" />
            ตารางเวลา
          </DialogTitle>
        </DialogHeader>

        {/* Date Navigation */}
        <div className="px-6 py-4 border-b border-border bg-muted">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => changeDate(-1)}
              disabled={!canGoBack}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <p className="text-lg font-semibold text-foreground">
              {formatDateThai(selectedDate)}
            </p>
            <Button variant="ghost" size="icon" onClick={() => changeDate(1)}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Week strip */}
          <div className="flex justify-center gap-1.5">
            {weekDates.map((d, i) => {
              const isSelected = toDateString(d) === dateStr;
              const isSun = d.getDay() === 0;
              const isPast = !isAdmin && toDateString(d) < todayStr;
              const isDisabled = isSun || isPast;
              const isToday = toDateString(d) === todayStr;
              return (
                <Button
                  key={i}
                  variant={isSelected ? "default" : isToday ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => !isDisabled && setSelectedDate(d)}
                  disabled={isDisabled}
                  className="flex flex-col h-auto px-3 py-2 min-w-[48px]"
                >
                  <span className="text-xs font-medium">{SHORT_THAI_DAYS[d.getDay()]}</span>
                  <span className="text-lg font-bold leading-tight">{d.getDate()}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="flex-1 overflow-hidden">
          {isSunday ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
              <Clock className="w-16 h-16 mb-4" />
              <p className="text-xl font-semibold">ร้านปิดวันอาทิตย์</p>
            </div>
          ) : loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6">
                {/* Legend */}
                <div className="flex items-center gap-6 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" />
                    <span className="text-muted-foreground">ว่าง</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700" />
                    <span className="text-muted-foreground">จองแล้ว</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[700px]">
                    <thead>
                      <tr>
                        <th className="sticky left-0 bg-muted px-3 py-3 text-left text-sm font-semibold text-foreground border border-border rounded-tl-lg z-10">
                          เวลา
                        </th>
                        {TABLE_NAMES.map((name) => (
                          <th
                            key={name}
                            className="px-3 py-3 text-center text-sm font-semibold text-foreground border border-border bg-muted"
                          >
                            {name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HOURS.map((hour) => (
                        <tr key={hour} className="group">
                          <td className="sticky left-0 bg-card px-3 py-3 text-sm font-medium text-foreground border border-border whitespace-nowrap z-10">
                            {String(hour).padStart(2, "0")}:00 - {String(hour + 1).padStart(2, "0")}:00
                          </td>
                          {TABLE_NAMES.map((tableName) => {
                            const booking = bookedMap[tableName]?.get(hour);
                            const isBooked = !!booking;
                            return (
                              <td
                                key={tableName}
                                className={`px-2 py-3 text-center text-xs border border-border transition-colors ${
                                  isBooked
                                    ? "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                                    : "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30"
                                }`}
                              >
                                {isBooked ? (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <Badge variant="destructive" className="text-xs">
                                      จองแล้ว
                                    </Badge>
                                    {isAdmin && booking && (
                                      <span className="text-muted-foreground text-[10px] leading-tight">
                                        {booking.customer_name} ({booking.guests} คน)
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs">
                                    ว่าง
                                  </Badge>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Separator className="my-4" />

                {/* Summary */}
                <h3 className="text-sm font-semibold text-foreground mb-3">สรุปวันนี้</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-muted-foreground text-xs">จำนวนการจอง</p>
                      <p className="text-xl font-bold text-foreground">{bookings.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-muted-foreground text-xs">โต๊ะที่มีคนจอง</p>
                      <p className="text-xl font-bold text-red-500">
                        {new Set(bookings.map((b) => b.table_name)).size}/{TABLE_NAMES.length}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-muted-foreground text-xs">ช่องว่างทั้งหมด</p>
                      <p className="text-xl font-bold text-green-600">
                        {TABLE_NAMES.length * HOURS.length -
                          TABLE_NAMES.reduce(
                            (sum, t) => sum + (bookedMap[t]?.size || 0),
                            0
                          )}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-muted-foreground text-xs">ช่องจองแล้ว</p>
                      <p className="text-xl font-bold text-red-500">
                        {TABLE_NAMES.reduce(
                          (sum, t) => sum + (bookedMap[t]?.size || 0),
                          0
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
