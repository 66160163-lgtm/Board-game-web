import { Users, Maximize, Wifi, Coffee, Waves, Tv } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";

interface RoomCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  size: number;
  capacity: number;
  amenities: string[];
  onBook: (id: number, name: string) => void;
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  breakfast: Coffee,
  pool: Waves,
  tv: Tv,
};

export function RoomCard({
  id,
  name,
  image,
  price,
  size,
  capacity,
  amenities,
  onBook,
}: RoomCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 right-3 bg-blue-600 text-lg px-3 py-1">
          ฿{price.toLocaleString()}/คืน
        </Badge>
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-xl mb-3">{name}</h3>
        <div className="flex gap-4 mb-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span className="text-sm">{size} ตร.ม.</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">{capacity} ท่าน</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {amenities.map((amenity) => {
            const Icon = amenityIcons[amenity];
            return (
              <Badge key={amenity} variant="secondary" className="gap-1">
                {Icon && <Icon className="w-3 h-3" />}
                {amenity === "wifi" && "Wi-Fi ฟรี"}
                {amenity === "breakfast" && "อาหารเช้า"}
                {amenity === "pool" && "สระว่ายน้ำ"}
                {amenity === "tv" && "ทีวี"}
              </Badge>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => onBook(id, name)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-base py-6"
        >
          จองห้องนี้
        </Button>
      </CardFooter>
    </Card>
  );
}
