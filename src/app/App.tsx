import { useState } from "react";
import { BoardGameCard } from "./components/BoardGameCard";
import { TableCard } from "./components/TableCard";
import { BookingModal } from "./components/BookingModal";
import { Toaster } from "./components/ui/sonner";
import { MapPin, Phone, Mail, Gamepad2, Coffee, Users, Wifi, Sparkles, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

const boardGames = [
  {
    id: 1,
    name: "Catan (ผู้ตั้งถิ่นฐานแห่งคาทาน)",
    image: "https://images.unsplash.com/photo-1563811771094-fe1d2520f4e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWNlJTIwYm9hcmQlMjBnYW1lfGVufDF8fHx8MTc3MzEzMTAwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerHour: 150,
    minPlayers: 3,
    maxPlayers: 4,
    duration: "60-90 นาที",
    difficulty: "ปานกลาง",
    category: "กลยุทธ์",
  },
  {
    id: 2,
    name: "Monopoly (โมโนโพลี)",
    image: "https://images.unsplash.com/photo-1640461470346-c8b56497850a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25vcG9seSUyMGJvYXJkJTIwZ2FtZXxlbnwxfHx8fDE3NzMxMzEwMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerHour: 120,
    minPlayers: 2,
    maxPlayers: 6,
    duration: "90-120 นาที",
    difficulty: "ง่าย",
    category: "ครอบครัว",
  },
  {
    id: 3,
    name: "Poker (โป๊กเกอร์)",
    image: "https://images.unsplash.com/photo-1601162937667-08f083516d57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF5aW5nJTIwY2FyZHMlMjBnYW1lfGVufDF8fHx8MTc3MzEzMTAwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerHour: 100,
    minPlayers: 2,
    maxPlayers: 8,
    duration: "30-60 นาที",
    difficulty: "ปานกลาง",
    category: "ไพ่",
  },
  {
    id: 4,
    name: "Chess (หมากรุก)",
    image: "https://images.unsplash.com/photo-1702143842605-d5a599320ad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWUlMjBjaGVzcyUyMHBpZWNlc3xlbnwxfHx8fDE3NzMxMzEwMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerHour: 80,
    minPlayers: 2,
    maxPlayers: 2,
    duration: "30-60 นาที",
    difficulty: "ยาก",
    category: "กลยุทธ์",
  },
  {
    id: 5,
    name: "Ticket to Ride (ตั๋วรถไฟ)",
    image: "https://images.unsplash.com/photo-1769893494602-54d305d7f3bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXRvcCUyMGdhbWUlMjBmcmllbmRzfGVufDF8fHx8MTc3MzA1NDkyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerHour: 150,
    minPlayers: 2,
    maxPlayers: 5,
    duration: "45-60 นาที",
    difficulty: "ง่าย",
    category: "ครอบครัว",
  },
  {
    id: 6,
    name: "Azul (อาซูล)",
    image: "https://images.unsplash.com/photo-1563811771094-fe1d2520f4e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWNlJTIwYm9hcmQlMjBnYW1lfGVufDF8fHx8MTc3MzEzMTAwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerHour: 140,
    minPlayers: 2,
    maxPlayers: 4,
    duration: "30-45 นาที",
    difficulty: "ปานกลาง",
    category: "กลยุทธ์",
  },
  {
    id: 7,
    name: "Codenames (โค้ดเนม)",
    image: "https://images.unsplash.com/photo-1601162937667-08f083516d57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF5aW5nJTIwY2FyZHMlMjBnYW1lfGVufDF8fHx8MTc3MzEzMTAwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerHour: 130,
    minPlayers: 4,
    maxPlayers: 8,
    duration: "15-30 นาที",
    difficulty: "ง่าย",
    category: "ปาร์ตี้",
  },
  {
    id: 8,
    name: "Pandemic (แพนเดมิก)",
    image: "https://images.unsplash.com/photo-1640461470346-c8b56497850a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25vcG9seSUyMGJvYXJkJTIwZ2FtZXxlbnwxfHx8fDE3NzMxMzEwMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerHour: 160,
    minPlayers: 2,
    maxPlayers: 4,
    duration: "45-60 นาที",
    difficulty: "ยาก",
    category: "กลยุทธ์",
  },
];

const tables = [
  {
    id: 1,
    name: "โต๊ะ 1",
    image: "https://images.unsplash.com/photo-1640703935937-5e6ec134977d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YX ЮрYW50JTIwdGFibGUlMjBzZXR0aW5nfGVufDF8fHx8MTc3MzAzOTk3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerPerson: 40,
    capacity: 4,
    location: "โซนหน้าร้าน",
    features: ["เต้าเสียบไฟ", "แสงสว่างดี"],
  },
  {
    id: 2,
    name: "โต๊ะ 2",
    image: "https://images.unsplash.com/photo-1750040970096-31907e42d6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwaW50ZXJpb3IlMjBjb3p5fGVufDF8fHx8MTc3MzA4MDA2NXww&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerPerson: 40,
    capacity: 4,
    location: "โซนหน้าร้าน",
    features: ["เต้าเสียบไฟ", "แสงสว่างดี"],
  },
  {
    id: 3,
    name: "โต๊ะ 3",
    image: "https://images.unsplash.com/photo-1640703935937-5e6ec134977d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YX ЮрYW50JTIwdGFibGUlMjBzZXR0aW5nfGVufDF8fHx8MTc3MzAzOTk3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerPerson: 40,
    capacity: 6,
    location: "โซนกลางร้าน",
    features: ["เต้าเสียบไฟ", "โต๊ะใหญ่"],
  },
  {
    id: 4,
    name: "โต๊ะ 4",
    image: "https://images.unsplash.com/photo-1750913717816-a32bfc6a5fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY29ybmVyJTIwY2FmZSUyMHNlYXRpbmd8ZW58MXx8fHwxNzczMTMxNDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerPerson: 40,
    capacity: 6,
    location: "โซนกลางร้าน",
    features: ["เต้าเสียบไฟ", "โต๊ะใหญ่"],
  },
  {
    id: 5,
    name: "โต๊ะ 5",
    image: "https://images.unsplash.com/photo-1750040970096-31907e42d6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwaW50ZXJpb3IlMjBjb3p5fGVufDF8fHx8MTc3MzA4MDA2NXww&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerPerson: 40,
    capacity: 4,
    location: "โซนริมหน้าต่าง",
    features: ["วิวสวย", "เต้าเสียบไฟ"],
  },
  {
    id:6,
    name: "โต๊ะ 6",
    image: "https://images.unsplash.com/photo-1640703935937-5e6ec134977d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YX ЮрYW50JTIwdGFibGUlMjBzZXR0aW5nfGVufDF8fHx8MTc3MzAzOTk3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerPerson: 40,
    capacity: 6,
    location: "โซนริมหน้าต่าง",
    features: ["วิวสวย", "เต้าเสียบไฟ"],
  },
  {
    id: 7,
    name: "โต๊ะ 7",
    image: "https://images.unsplash.com/photo-1750913717816-a32bfc6a5fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY29ybmVyJTIwY2FmZSUyMHNlYXRpbmd8ZW58MXx8fHwxNzczMTMxNDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    pricePerPerson: 40,
    capacity: 4,
    location: "โซนหลังร้าน",
    features: ["เงียบสงบ", "เต้าเสียบไฟ"],
  },
];

const menuItems = [
  {
    id: 1,
    name: "French Fries",
    price: 40,
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBmcmllc3xlbnwxfHx8fDE3NzMxMzE0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "food",
    extras: [{ name: "Cheese Dip", price: 15 }],
  },
  {
    id: 2,
    name: "MaMacup",
    price: 20,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YW50JTIwbm9vZGxlc3xlbnwxfHx8fDE3NzMxMzE0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "food",
  },
  {
    id: 3,
    name: "Twining Tea",
    price: 40,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWElMjBjdXB8ZW58MXx8fHwxNzczMTMxNDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "drink",
  },
  {
    id: 4,
    name: "Coca Cola",
    price: 20,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NhJTIwY29sYXxlbnwxfHx8fDE3NzMxMzE0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "drink",
  },
  {
    id: 5,
    name: "SinghSoda",
    price: 20,
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2RhJTIwZHJpbmt8ZW58MXx8fHwxNzczMTMxNDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "drink",
  },
  {
    id: 6,
    name: "Water",
    price: 10,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZXxlbnwxfHx8fDE3NzMxMzE0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "drink",
  },
];

export default function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ id: 0, name: "", type: 'table' as 'table' | 'game' });
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleBooking = (id: number, name: string, type: 'table' | 'game') => {
    setSelectedItem({ id, name, type });
    setIsBookingModalOpen(true);
  };

  const categories = ["all", "กลยุทธ์", "ครอบครัว", "ไพ่", "ปาร์ตี้"];
  
  const filteredGames = selectedCategory === "all" 
    ? boardGames 
    : boardGames.filter(game => game.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Game Hub Cafe
                </h1>
                <p className="text-sm text-gray-600">คาเฟ่บอร์ดเกม บางแสน</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#tables" className="text-gray-600 hover:text-purple-600">
                โต๊ะ
              </a>
              <a href="#games" className="text-gray-600 hover:text-purple-600">
                บอร์ดเกม
              </a>
              <a href="#menu" className="text-gray-600 hover:text-purple-600">
                เมนู
              </a>
              <a href="#facilities" className="text-gray-600 hover:text-purple-600">
                สิ่งอำนวยความสะดวก
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-purple-600">
                ราคา
              </a>
              <a href="#contact" className="text-gray-600 hover:text-purple-600">
                ติดต่อ
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-purple-600 to-pink-600">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1750040970096-31907e42d6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwaW50ZXJpb3IlMjBjb3p5fGVufDF8fHx8MTc3MzA4MDA2NXww&ixlib=rb-4.1.0&q=80&w=1080")',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
          <Gamepad2 className="w-20 h-20 text-white mb-4" />
          <h2 className="text-6xl font-bold text-white mb-4">
            Game Hub Cafe
          </h2>
          <p className="text-2xl text-white/95 mb-2">
            จองโต๊ะและบอร์ดเกม
          </p>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            บอร์ดเกมกว่า 100+ เกม โต๊ะหลากหลายขนาด พร้อมเครื่องดื่มและอาหารอร่อย
          </p>
          <div className="flex gap-4">
            <a
              href="#tables"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              จองโต๊ะ
            </a>
            <a
              href="#games"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors border-2 border-white"
            >
              เลือกบอร์ดเกม
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              เกี่ยวกับเรา
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Game Hub Cafe เป็นคาเฟ่บอร์ดเกมที่ใหญ่ที่สุดในบางแสน 
              มีบอร์ดเกมให้เลือกเล่นมากกว่า 100+ เกม ตั้งแต่เกมง่ายๆ สำหรับครอบครัว 
              ไปจนถึงเกมกลยุทธ์ระดับสูงสำหรับผู้เล่นมืออาชีพ 
              พร้อมเครื่องดื่มและอาหารหลากหลาย บรรยากาศสบาย มีพนักงานคอยแนะนำและสอนวิธีเล่น 
              เปิดบริการทุกวัน 10:00-23:00 น.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Tables Section */}
        <section id="tables" className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
              โต๊ะของเรา
            </h2>
            <p className="text-gray-600 text-center mb-6">
              เลือกโต๊ะที่เหมาะกับกลุ่มของคุณ พร้อมสิ่งอำนวยความสะดวกครบครัน
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tables.map((table) => (
              <TableCard key={table.id} {...table} onBook={handleBooking} />
            ))}
          </div>
        </section>

        {/* Games Section */}
        <section id="games" className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
              บอร์ดเกมของเรา
            </h2>
            <p className="text-gray-600 text-center mb-6">
              เลือกเกมโปรดของคุณ สามารถจองพร้อมโต๊ะหรือเลือกเกมที่ร้านก็ได้
            </p>
            
            {/* Category Filter */}
            <div className="flex justify-center gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 hover:bg-purple-100"
                  }`}
                >
                  {category === "all" ? "ทั้งหมด" : category}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <BoardGameCard key={game.id} {...game} onBook={(id, name) => handleBooking(id, name, 'game')} />
            ))}
          </div>
        </section>

        {/* Facilities Section */}
        <section id="facilities" className="mb-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            สิ่งอำนวยความสะดวก
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Coffee className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">เครื่องดื่มและอาหาร</h3>
              <p className="text-gray-600 text-sm">
                เครื่องดื่มชา กาแฟ ปั่น พร้อมขนมและอาหารว่างมากมาย
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Wifi className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Wi-Fi ฟรี</h3>
              <p className="text-gray-600 text-sm">
                Wi-Fi ความเร็วสูง สำหรับทำงานหรือเล่นเกมออนไลน์
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">พนักงานแนะนำ</h3>
              <p className="text-gray-600 text-sm">
                มีพนักงานคอยแนะนำและสอนวิธีเล่นเกม
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Gamepad2 className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100+ เกม</h3>
              <p className="text-gray-600 text-sm">
                บอร์ดเกมหลากหลายประเภทกว่า 100 เกม
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">ห้องส่วนตัว VIP</h3>
              <p className="text-gray-600 text-sm">
                ห้องส่วนตัวสำหรับกลุ่มใหญ่ รองรับได้ 8-12 คน
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">เปิดทุกวัน</h3>
              <p className="text-gray-600 text-sm">
                เปิดบริการทุกวัน 10:00-23:00 น.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mb-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-4xl font-bold mb-6 text-center">
              ราคาและโปรโมชั่น
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-semibold text-xl mb-3">ค่าที่นั่ง (ต่อคน)</h3>
                <p className="text-3xl font-bold mb-2">฿40</p>
                <p className="text-sm mb-4">ต่อชั่วโมง</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ จองได้สูงสุด 3 ชั่วโมง</li>
                  <li>✓ เหมาะสำหรับเล่นเกมสั้นๆ</li>
                  <li>✓ มีพนักงานแนะนำเกม</li>
                </ul>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border-2 border-white">
                <div className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                  คุ้มที่สุด
                </div>
                <h3 className="font-semibold text-xl mb-3">แพ็กเกจ 3 ชั่วโมง</h3>
                <p className="text-3xl font-bold mb-2">฿120</p>
                <p className="text-sm mb-4">ต่อคน (3 ชั่วโมง)</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ เล่นได้ 3 ชั่วโมงเต็ม</li>
                  <li>✓ ประหยัดกว่ารายชั่วโมง</li>
                  <li>✓ เหมาะสำหรับเกมยาวๆ</li>
                  <li>✓ สามารถสั่งอาหารและเครื่องดื่มเพิ่มได้</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-white/90">
                💡 ค่าเกมแยกต่างหาก: ฿80-160/ชั่วโมง ต่อเกม (หรือสามารถเลือกเกมที่ร้านได้ฟรี)
              </p>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
              เมนูอาหารและเครื่องดื่ม
            </h2>
            <p className="text-gray-600 text-center mb-6">
              อาหารและเครื่องดื่มสดใหม่ เสิร์ฟร้อนๆ ถึงโต๊ะ
            </p>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
              <TabsTrigger value="food">อาหาร</TabsTrigger>
              <TabsTrigger value="drink">เครื่องดื่ม</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                      <p className="text-purple-600 font-bold">฿{item.price}</p>
                      {item.extras && (
                        <p className="text-xs text-gray-500 mt-1">
                          + {item.extras[0].name} ฿{item.extras[0].price}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="food" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {menuItems.filter(item => item.category === 'food').map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                      <p className="text-purple-600 font-bold">฿{item.price}</p>
                      {item.extras && (
                        <p className="text-xs text-gray-500 mt-1">
                          + {item.extras[0].name} ฿{item.extras[0].price}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="drink" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {menuItems.filter(item => item.category === 'drink').map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                      <p className="text-purple-600 font-bold">฿{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16" id="contact">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <Gamepad2 className="w-6 h-6" />
                Game Hub Cafe
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                คาเฟ่บอร์ดเกมครบวงจรในบางแสน ชลบุรี
                มีบอร์ดเกมให้เลือกเล่นมากกว่า 100 เกม
                พร้อมเครื่องดื่มและอาหารอร่อยๆ บรรยากาศสบาย
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-4">ติดต่อเรา</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>123/45 ถ.บางแสน-อ่างศิลา ต.แสนสุข อ.เมือง จ.ชลบุรี 20131</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>038-567-890, 095-678-9012</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>info@gamehubcafe.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-4">เวลาทำการ</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>จันทร์-ศุกร์: 14.00-24.00 น.</p>
                <p>อาทิตย์: หยุด</p>
                <p className="pt-3 text-purple-400">
                  💡 แนะนำจองล่วงหน้าช่วงวันหยุด
                </p>
                <p className="pt-3">
                  <a href="#tables" className="text-purple-400 hover:text-purple-300">
                    → จองโต๊ะและบอร์ดเกมออนไลน์
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 Game Hub Cafe. สงวนลิขสิทธิ์.
          </div>
        </div>
      </footer>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        itemName={selectedItem.name}
        itemType={selectedItem.type}
        tables={tables}
        games={boardGames}
      />
    </div>
  );
}