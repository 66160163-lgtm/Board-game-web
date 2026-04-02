import { Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";

interface TableCardProps {
  id: number;
  name: string;
  image: string;
  pricePerPerson: number;
  capacity: number;
  onBook: (id: number, name: string, type: 'table') => void;
}

export function TableCard({
  id,
  name,
  image,
  pricePerPerson,
  capacity,
  onBook,
}: TableCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 right-3 bg-green-600 text-base px-3 py-1">
          ฿{pricePerPerson}/คน/ชม.
        </Badge>
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-xl mb-3">{name}</h3>
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">รองรับ 6-{capacity} คน</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => onBook(id, name, 'table')}
          className="w-full bg-green-600 hover:bg-green-700 text-base py-6"
        >
          จองโต๊ะนี้
        </Button>
      </CardFooter>
    </Card>
  );
}