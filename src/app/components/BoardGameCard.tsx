import { Users, Clock, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";

interface BoardGameCardProps {
  id: number;
  name: string;
  image: string;
  pricePerHour: number;
  minPlayers: number;
  maxPlayers: number;
  duration: string;
  difficulty: string;
  category: string;
  onBook: (id: number, name: string) => void;
}

const difficultyColors: Record<string, string> = {
  ง่าย: "bg-green-100 text-green-800",
  ปานกลาง: "bg-yellow-100 text-yellow-800",
  ยาก: "bg-red-100 text-red-800",
};

export function BoardGameCard({
  id,
  name,
  image,
  pricePerHour,
  minPlayers,
  maxPlayers,
  duration,
  difficulty,
  category,
  onBook,
}: BoardGameCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 right-3 bg-purple-600 text-base px-3 py-1">
          ฿{pricePerHour}/ชม.
        </Badge>
        <Badge className={`absolute top-3 left-3 ${difficultyColors[difficulty]}`}>
          {difficulty}
        </Badge>
      </div>
      <CardContent className="p-5">
        <div className="mb-2">
          <Badge variant="outline" className="mb-2">
            {category}
          </Badge>
          <h3 className="font-semibold text-xl">{name}</h3>
        </div>
        <div className="space-y-2 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{minPlayers}-{maxPlayers} คน</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => onBook(id, name)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-base py-6"
        >
          จองเกมนี้
        </Button>
      </CardFooter>
    </Card>
  );
}
