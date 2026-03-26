import { MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface AttractionCardProps {
  name: string;
  description: string;
  image: string;
  distance: string;
}

export function AttractionCard({
  name,
  description,
  image,
  distance,
}: AttractionCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <div className="flex items-center gap-1 text-blue-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{distance}</span>
        </div>
      </CardContent>
    </Card>
  );
}
