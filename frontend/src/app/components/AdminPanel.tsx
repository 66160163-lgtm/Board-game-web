import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Calendar, Clock, Users, MapPin, Phone, Trash2, User, CheckCircle2, CircleDashed } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { toast } from "sonner";

interface Booking {
  id: number;
  customer_name: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  hours: number;
  guests: number;
  table_name: string;
  user_id: string | null;
  created_at: string;
  status: string | null;
  menu_orders: Array<{ name: string; qty: number; price: number; extras?: Array<{ name: string; qty: number; price: number }> }> | null;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  const deleteBooking = async (id: number) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast.error("ลบไม่สำเร็จ", { description: error.message });
    } else {
      toast.success("ลบการจองเรียบร้อย");
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const toggleStatus = async (id: number, currentStatus: string | null) => {
    const newStatus = currentStatus === "arrived" ? "pending" : "arrived";
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      toast.error("อัพเดทสถานะไม่สำเร็จ", { description: error.message });
    } else {
      toast.success(newStatus === "arrived" ? "ลูกค้ามาแล้ว ✓" : "เปลี่ยนกลับเป็นรอมา");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    }
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

  const upcoming = bookings.filter(
    (b) => new Date(b.booking_date) >= new Date(new Date().toDateString())
  );
  const past = bookings.filter(
    (b) => new Date(b.booking_date) < new Date(new Date().toDateString())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">แผงควบคุมผู้ดูแล (Admin)</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground mb-2">
          ทั้งหมด {bookings.length} รายการ | กำลังจะมา {upcoming.length} | เสร็จแล้ว {past.length}
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">กำลังโหลด...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">ยังไม่มีการจอง</div>
        ) : (
          <div className="space-y-3">
            {upcoming.length > 0 && (
              <>
                <h3 className="font-semibold text-foreground text-sm mt-2">กำลังจะมา</h3>
                {upcoming.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} onDelete={deleteBooking} onToggleStatus={toggleStatus} formatDate={formatDate} formatTime={formatTime} />
                ))}
              </>
            )}
            {past.length > 0 && (
              <>
                <h3 className="font-semibold text-muted-foreground text-sm mt-4">เสร็จแล้ว</h3>
                {past.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} onDelete={deleteBooking} onToggleStatus={toggleStatus} formatDate={formatDate} formatTime={formatTime} isPast />
                ))}
              </>
            )}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>ปิด</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BookingCard({
  booking,
  onDelete,
  onToggleStatus,
  formatDate,
  formatTime,
  isPast = false,
}: {
  booking: Booking;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: string | null) => void;
  formatDate: (d: string) => string;
  formatTime: (t: string) => string;
  isPast?: boolean;
}) {
  const isArrived = booking.status === "arrived";
  return (
    <Card className={isArrived ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : ""}>
      <CardContent className="p-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-foreground">{booking.table_name}</h4>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="w-3 h-3" />
            {booking.customer_name}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onToggleStatus(booking.id, booking.status)}
            className={`rounded-full text-xs gap-1 h-7 px-2 ${
              isArrived
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-200"
            }`}
            title={isArrived ? "กดเพื่อเปลี่ยนเป็นรอมา" : "กดเพื่อยืนยันลูกค้ามาแล้ว"}
          >
            {isArrived ? (
              <><CheckCircle2 className="w-3.5 h-3.5" /> มาแล้ว</>
            ) : (
              <><CircleDashed className="w-3.5 h-3.5" /> รอมา</>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-red-500"
            onClick={() => onDelete(booking.id)}
            title="ลบการจอง"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
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
          <Phone className="w-3.5 h-3.5" />
          {booking.phone}
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
}
