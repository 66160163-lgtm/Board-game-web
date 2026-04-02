import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar, Clock, Minus, Plus, UtensilsCrossed, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../utils/supabase";
import { useAuth } from "./AuthProvider";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  extras?: Array<{ name: string; price: number }>;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  menuItems: MenuItem[];
}

export function BookingModal({
  isOpen,
  onClose,
  tableName,
  menuItems,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    hours: "2",
    guests: "6",
  });
  const [menuOrders, setMenuOrders] = useState<Record<number, number>>({});
  const [extraOrders, setExtraOrders] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMenuOrders({});
      setExtraOrders({});
    }
  }, [isOpen]);

  const updateMenuQty = (id: number, delta: number) => {
    setMenuOrders((prev) => {
      const qty = Math.max(0, (prev[id] || 0) + delta);
      if (qty === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: qty };
    });
  };

  const updateExtraQty = (key: string, delta: number) => {
    setExtraOrders((prev) => {
      const qty = Math.max(0, (prev[key] || 0) + delta);
      if (qty === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: qty };
    });
  };

  const getMenuTotal = () => {
    let total = 0;
    for (const [idStr, qty] of Object.entries(menuOrders)) {
      const item = menuItems.find((m) => m.id === Number(idStr));
      if (item) total += item.price * qty;
    }
    for (const [key, qty] of Object.entries(extraOrders)) {
      const [itemIdStr, extraName] = key.split("::");
      const item = menuItems.find((m) => m.id === Number(itemIdStr));
      const extra = item?.extras?.find((e) => e.name === extraName);
      if (extra) total += extra.price * qty;
    }
    return total;
  };

  const buildMenuOrdersJson = () => {
    const orders: Array<{ name: string; qty: number; price: number; extras?: Array<{ name: string; qty: number; price: number }> }> = [];
    for (const [idStr, qty] of Object.entries(menuOrders)) {
      const item = menuItems.find((m) => m.id === Number(idStr));
      if (!item) continue;
      const itemExtras: Array<{ name: string; qty: number; price: number }> = [];
      if (item.extras) {
        for (const ex of item.extras) {
          const exKey = `${item.id}::${ex.name}`;
          const exQty = extraOrders[exKey] || 0;
          if (exQty > 0) itemExtras.push({ name: ex.name, qty: exQty, price: ex.price });
        }
      }
      orders.push({ name: item.name, qty, price: item.price, ...(itemExtras.length > 0 ? { extras: itemExtras } : {}) });
    }
    return orders.length > 0 ? orders : null;
  };

  const timeToMinutes = (t: string) => {
    const parts = t.split(":").map(Number);
    return parts[0] * 60 + parts[1];
  };

  const validateBookingTime = (): string | null => {
    if (formData.date) {
      const selectedDate = new Date(formData.date + "T00:00:00");
      if (selectedDate.getDay() === 0) {
        return "ร้านปิดวันอาทิตย์ กรุณาเลือกวันอื่น";
      }
    }
    if (formData.time) {
      const [h, m] = formData.time.split(":").map(Number);
      const totalMin = h * 60 + m;
      if (totalMin < 840 || totalMin >= 1440) {
        return "กรุณาเลือกเวลาระหว่าง 14:00 - 24:00 น.";
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateBookingTime();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setIsSubmitting(true);
    try {
      // Check for overlapping bookings on the same table & date
      const newStart = timeToMinutes(formData.time);
      const newEnd = newStart + Number(formData.hours) * 60;

      const { data: existing } = await supabase
        .from("bookings")
        .select("booking_time, hours")
        .eq("booking_date", formData.date)
        .eq("table_name", tableName);

      if (existing && existing.length > 0) {
        const overlap = existing.some((b: any) => {
          const bStart = timeToMinutes(b.booking_time);
          const bEnd = bStart + (b.hours || 2) * 60;
          return newStart < bEnd && newEnd > bStart;
        });
        if (overlap) {
          toast.error("ช่วงเวลานี้มีการจองแล้ว", {
            description: "กรุณาเลือกเวลาอื่นหรือเลือกโต๊ะอื่น",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const { error } = await supabase.from("bookings").insert({
        customer_name: formData.name,
        phone: formData.phone,
        booking_date: formData.date,
        booking_time: formData.time,
        hours: Number(formData.hours),
        guests: Number(formData.guests),
        table_name: tableName,
        user_id: user!.id,
        menu_orders: buildMenuOrdersJson(),
      });
      if (error) throw error;
      toast.success("การจองสำเร็จ!", {
        description: `คุณได้จอง ${tableName} เรียบร้อยแล้ว`,
      });
      onClose();
      setFormData({ name: "", phone: "", date: "", time: "", hours: "2", guests: "6" });
      setMenuOrders({});
      setExtraOrders({});
    } catch (err: any) {
      console.error("Booking error:", err);
      toast.error("เกิดข้อผิดพลาด", {
        description: err?.message || "ไม่สามารถจองได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const foodItems = menuItems.filter((m) => m.category === "food");
  const drinkItems = menuItems.filter((m) => m.category === "drink");
  const menuTotal = getMenuTotal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>จองโต๊ะ</DialogTitle>
          <DialogDescription>
            โต๊ะ: <span className="font-semibold text-foreground">{tableName}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> วันที่เล่น
                </Label>
                <DatePickerNoSunday
                  value={formData.date}
                  onChange={(val) => setFormData({ ...formData, date: val })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> เวลา
                </Label>
                <TimePickerScroll
                  value={formData.time}
                  onChange={(val) => setFormData({ ...formData, time: val })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hours">จำนวนชั่วโมง {formData.time && `(เหลือ ${24 - Number(formData.time.split(":")[0])} ชม.)`}</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  max={formData.time ? 24 - Number(formData.time.split(":")[0]) : undefined}
                  value={formData.hours}
                  onChange={(e) => {
                    const maxH = formData.time ? 24 - Number(formData.time.split(":")[0]) : Infinity;
                    const val = Math.min(Number(e.target.value), maxH);
                    setFormData({ ...formData, hours: val < 1 ? "1" : String(val) });
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guests">จำนวนผู้เล่น</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Menu */}
            <div className="border-t pt-4 mt-2">
              <Label className="flex items-center gap-1 text-base font-semibold mb-3">
                <UtensilsCrossed className="w-4 h-4" /> สั่งเมนูล่วงหน้า
                <span className="text-xs font-normal text-muted-foreground ml-1">(ไม่บังคับ)</span>
              </Label>

              {foodItems.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-foreground/80 mb-2">อาหาร</p>
                  <div className="space-y-2">
                    {foodItems.map((item) => (
                      <MenuItemRow
                        key={item.id}
                        item={item}
                        qty={menuOrders[item.id] || 0}
                        onUpdate={(d) => updateMenuQty(item.id, d)}
                        extraOrders={extraOrders}
                        onExtraUpdate={updateExtraQty}
                      />
                    ))}
                  </div>
                </div>
              )}

              {drinkItems.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-foreground/80 mb-2">เครื่องดื่ม</p>
                  <div className="space-y-2">
                    {drinkItems.map((item) => (
                      <MenuItemRow
                        key={item.id}
                        item={item}
                        qty={menuOrders[item.id] || 0}
                        onUpdate={(d) => updateMenuQty(item.id, d)}
                        extraOrders={extraOrders}
                        onExtraUpdate={updateExtraQty}
                      />
                    ))}
                  </div>
                </div>
              )}

              {menuTotal > 0 && (
                <div className="text-right text-sm font-semibold text-foreground mt-2">
                  รวมเมนู: ฿{menuTotal}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังจอง..." : "ยืนยันการจอง"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MenuItemRow({
  item,
  qty,
  onUpdate,
  extraOrders,
  onExtraUpdate,
}: {
  item: MenuItem;
  qty: number;
  onUpdate: (delta: number) => void;
  extraOrders: Record<string, number>;
  onExtraUpdate: (key: string, delta: number) => void;
}) {
  return (
    <Card>
      <CardContent className="p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
          <div>
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">฿{item.price}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="w-7 h-7 rounded-full"
            onClick={() => onUpdate(-1)}
            disabled={qty === 0}
          >
            <Minus className="w-3.5 h-3.5" />
          </Button>
          <span className="w-6 text-center text-sm font-medium">{qty}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="w-7 h-7 rounded-full"
            onClick={() => onUpdate(1)}
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      {item.extras && qty > 0 && (
        <div className="mt-1 ml-12 space-y-1">
          {item.extras.map((ex) => {
            const exKey = `${item.id}::${ex.name}`;
            const exQty = extraOrders[exKey] || 0;
            return (
              <div key={exKey} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">+ {ex.name} (฿{ex.price})</span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="w-5 h-5 rounded-full"
                    onClick={() => onExtraUpdate(exKey, -1)}
                    disabled={exQty === 0}
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </Button>
                  <span className="w-4 text-center">{exQty}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="w-5 h-5 rounded-full"
                    onClick={() => onExtraUpdate(exKey, 1)}
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </CardContent>
    </Card>
  );
}

function DatePickerNoSunday({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initial = value ? new Date(value + "T00:00:00") : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDisplay = value
    ? `${parseInt(value.split("-")[2])} ${monthNames[parseInt(value.split("-")[1]) - 1]} ${value.split("-")[0]}`
    : "";

  const cells: Array<{ day: number; disabled: boolean; selected: boolean; past: boolean }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: 0, disabled: true, selected: false, past: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    const isSunday = date.getDay() === 0;
    const isPast = date < today;
    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}`;
    cells.push({ day: d, disabled: isSunday || isPast, selected: dateStr === value, past: isPast });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? formatDisplay : "เลือกวันที่"}
        </span>
        <Calendar className="w-4 h-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-lg shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <Button type="button" variant="ghost" size="icon" className="w-7 h-7" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">{monthNames[viewMonth]} {viewYear}</span>
            <Button type="button" variant="ghost" size="icon" className="w-7 h-7" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d, i) => (
              <div key={d + i} className={`font-medium py-1 ${i === 0 ? "text-red-400" : "text-muted-foreground"}`}>{d}</div>
            ))}
            {cells.map((c, i) =>
              c.day === 0 ? (
                <div key={"e" + i} />
              ) : (
                <button
                  key={i}
                  type="button"
                  disabled={c.disabled}
                  onClick={() => {
                    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(c.day)}`;
                    onChange(dateStr);
                    setOpen(false);
                  }}
                  className={`py-1 rounded text-sm
                    ${c.selected ? "bg-primary text-primary-foreground font-bold" : ""}
                    ${c.disabled ? "text-muted-foreground/40 line-through cursor-not-allowed" : "hover:bg-accent cursor-pointer"}
                    ${!c.disabled && !c.selected && new Date(viewYear, viewMonth, c.day).getDay() === 6 ? "text-blue-500" : ""}
                  `}
                >
                  {c.day}
                </button>
              )
            )}
          </div>
          <p className="text-xs text-red-400 mt-2 text-center">* ร้านปิดวันอาทิตย์</p>
        </div>
      )}
    </div>
  );
}

function TimePickerScroll({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 10 }, (_, i) => i + 14); // 14-23
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,10,...55

  const parsed = value ? value.split(":").map(Number) : [14, 0];
  const [selHour, setSelHour] = useState(parsed[0]);
  const [selMin, setSelMin] = useState(parsed[1]);

  const pad = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      setSelHour(h);
      setSelMin(m);
    }
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const hIdx = hours.indexOf(selHour);
        const mIdx = minutes.indexOf(selMin);
        if (hourRef.current && hIdx >= 0) {
          hourRef.current.scrollTop = hIdx * 36 - 72;
        }
        if (minRef.current && mIdx >= 0) {
          minRef.current.scrollTop = mIdx * 36 - 72;
        }
      }, 50);
    }
  }, [open]);

  const handleConfirm = () => {
    onChange(`${pad(selHour)}:${pad(selMin)}`);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? `${pad(parsed[0])}:${pad(parsed[1])} น.` : "เลือกเวลา"}
        </span>
        <Clock className="w-4 h-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-xs text-muted-foreground text-center mb-2">เปิดบริการ 14:00 - 24:00 น.</p>
          <div className="flex justify-center gap-2">
            {/* Hour column */}
            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-9 bg-accent rounded pointer-events-none z-0" />
              <div
                ref={hourRef}
                className="h-[180px] overflow-y-auto scrollbar-thin relative z-10"
                style={{ scrollbarWidth: "none" }}
              >
                <div className="h-[72px]" />
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setSelHour(h)}
                    className={`w-14 h-9 flex items-center justify-center text-lg transition-all
                      ${selHour === h ? "text-foreground font-bold scale-110" : "text-muted-foreground hover:text-foreground"}
                    `}
                  >
                    {pad(h)}
                  </button>
                ))}
                <div className="h-[72px]" />
              </div>
            </div>

            <div className="flex items-center text-xl font-bold text-muted-foreground">:</div>

            {/* Minute column */}
            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-9 bg-accent rounded pointer-events-none z-0" />
              <div
                ref={minRef}
                className="h-[180px] overflow-y-auto scrollbar-thin relative z-10"
                style={{ scrollbarWidth: "none" }}
              >
                <div className="h-[72px]" />
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelMin(m)}
                    className={`w-14 h-9 flex items-center justify-center text-lg transition-all
                      ${selMin === m ? "text-foreground font-bold scale-110" : "text-muted-foreground hover:text-foreground"}
                    `}
                  >
                    {pad(m)}
                  </button>
                ))}
                <div className="h-[72px]" />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <Separator className="mb-2" />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                ยกเลิก
              </Button>
              <Button type="button" size="sm" onClick={handleConfirm}>
                ตกลง
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
