import { Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

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
    <Card className="overflow-hidden group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{name}</h3>
          <span className="text-sm text-muted-foreground">฿{pricePerPerson}/คน/ชม.</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Users className="h-3.5 w-3.5" />
          <span>6–{capacity} คน</span>
        </div>
        <Button onClick={() => onBook(id, name, 'table')} className="w-full" size="sm">
          จองโต๊ะนี้
        </Button>
      </CardContent>
    </Card>
  );
}