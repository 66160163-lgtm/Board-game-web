import { MapPin, Star, Wifi, Coffee, Waves } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";

interface HotelCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  amenities: string[];
  onBook: (id: number, name: string) => void;
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  breakfast: Coffee,
  pool: Waves,
};

export function HotelCard({
  id,
  name,
  image,
  price,
  rating,
  reviews,
  location,
  amenities,
  onBook,
}: HotelCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 right-3 bg-blue-600">
          ฿{price.toLocaleString()}/คืน
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-sm text-gray-500">({reviews})</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
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
              </Badge>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onBook(id, name)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          จองเลย
        </Button>
      </CardFooter>
    </Card>
  );
}
