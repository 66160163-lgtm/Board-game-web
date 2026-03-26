import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { Calendar, Clock, Users, MapPin, CheckCircle2, CircleDashed } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { useAuth } from "./AuthProvider";

interface Booking {
  id: number;
  customer_name: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  hours: number;
  guests: number;
  table_name: string;
  created_at: string;
  status: string | null;
  menu_orders: Array<{ name: string; qty: number; price: number; extras?: Array<{ name: string; qty: number; price: number }> }> | null;
}

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyBookingsModal({ isOpen, onClose }: MyBookingsModalProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      fetchBookings();
    }
  }, [isOpen, user]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user!.id)
      .order("booking_date", { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5) + " น.";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>การจองของฉัน</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>ยังไม่มีการจอง</p>
            <p className="text-sm mt-1">จองโต๊ะเพื่อเริ่มเล่นบอร์ดเกม!</p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {bookings.map((booking) => {
              const isPast = new Date(booking.booking_date) < new Date(new Date().toDateString());
              const isArrived = booking.status === "arrived";
              return (
                <Card
                  key={booking.id}
                  className={isArrived ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-muted"}
                >
                  <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">
                      {booking.table_name}
                    </h4>
                    <Badge
                      className={`gap-1 ${
                        isArrived
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : isPast
                          ? "bg-muted text-muted-foreground hover:bg-muted"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 hover:bg-yellow-100"
                      }`}
                    >
                      {isArrived ? (
                        <><CheckCircle2 className="w-3 h-3" /> มาแล้ว</>
                      ) : isPast ? (
                        "เสร็จแล้ว"
                      ) : (
                        <><CircleDashed className="w-3 h-3" /> รอมา</>
                      )}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(booking.booking_date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(booking.booking_time)} ({booking.hours} ชม.)
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {booking.guests} คน
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {booking.customer_name}
                    </div>
                  </div>
                  {booking.menu_orders && booking.menu_orders.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <Separator className="mb-2" />
                      <p className="font-medium text-foreground/80 mb-1">เมนูที่สั่ง:</p>
                      {booking.menu_orders.map((item, i) => (
                        <div key={i}>
                          {item.name} x{item.qty} (฿{item.price * item.qty})
                          {item.extras?.map((ex, j) => (
                            <span key={j} className="ml-2 text-muted-foreground">+{ex.name} x{ex.qty}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="pt-2">
          <Button variant="outline" onClick={onClose} className="w-full">
            ปิด
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
