import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemType: 'table' | 'game';
  tables: Array<{ id: number; name: string }>;
  games: Array<{ id: number; name: string; pricePerHour: number }>;
}

export function BookingModal({ 
  isOpen, 
  onClose, 
  itemName, 
  itemType,
  tables,
  games 
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    hours: "2",
    guests: "4",
    tableId: itemType === 'table' ? itemName : "",
    selectedGames: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedGamesText = formData.selectedGames.length > 0 
      ? ` พร้อมเกม: ${formData.selectedGames.join(", ")}` 
      : "";
    toast.success("การจองสำเร็จ!", {
      description: `คุณได้จอง ${formData.tableId}${selectedGamesText} เรียบร้อยแล้ว`,
    });
    onClose();
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      hours: "2",
      guests: "4",
      tableId: "",
      selectedGames: [],
    });
  };

  const toggleGame = (gameName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGames: prev.selectedGames.includes(gameName)
        ? prev.selectedGames.filter(g => g !== gameName)
        : [...prev.selectedGames, gameName]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>จองโต๊ะและบอร์ดเกม</DialogTitle>
          <DialogDescription>
            {itemType === 'table' ? `โต๊ะ: ${itemName}` : `เกม: ${itemName}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  วันที่เล่น
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  เวลา
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hours">จำนวนชั่วโมง</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.hours}
                  onChange={(e) =>
                    setFormData({ ...formData, hours: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, guests: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Table Selection */}
            <div className="grid gap-2">
              <Label htmlFor="table">เลือกโต๊ะ</Label>
              <Select
                value={formData.tableId}
                onValueChange={(value) =>
                  setFormData({ ...formData, tableId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="กรุณาเลือกโต๊ะ" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((table) => (
                    <SelectItem key={table.id} value={table.name}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Game Selection */}
            <div className="grid gap-2">
              <Label>เลือกบอร์ดเกม (เลือกได้หลายเกม)</Label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                <div className="space-y-3">
                  {games.map((game) => (
                    <div key={game.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`game-${game.id}`}
                        checked={formData.selectedGames.includes(game.name)}
                        onCheckedChange={() => toggleGame(game.name)}
                      />
                      <label
                        htmlFor={`game-${game.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {game.name}
                        <span className="text-gray-500 ml-2">
                          (฿{game.pricePerHour}/ชม.)
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                หมายเหตุ: สามารถเลือกได้หลายเกม หรือไม่เลือกก็ได้ (สามารถเลือกเกมที่ร้านได้)
              </p>
            </div>

            {/* Summary */}
            {formData.selectedGames.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">สรุปการจอง:</h4>
                <p className="text-sm text-gray-700">
                  เกมที่เลือก: {formData.selectedGames.join(", ")}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  จำนวนเกม: {formData.selectedGames.length} เกม
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              ยืนยันการจอง
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
