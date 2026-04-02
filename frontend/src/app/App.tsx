import { useState, useEffect } from "react";
import { TableCard } from "./components/TableCard";
import { BookingModal } from "./components/BookingModal";
import { AuthModal } from "./components/AuthModal";
import { MyBookingsModal } from "./components/MyBookingsModal";
import { AdminPanel } from "./components/AdminPanel";
import { ScheduleView } from "./components/ScheduleView";
import { useAuth } from "./components/AuthProvider";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { MapPin, Phone, Facebook, Gamepad2, Coffee, Users, Wifi, Clock, LogIn, LogOut, User, CalendarDays, Shield, Moon, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./components/ui/carousel";
import { toast } from "sonner";

const gameImages = [
  { src: "/game/71iiM1OAgML._AC_UF8941000_QL80_.png", alt: "Board Game 1" },
  { src: "/game/8c56215cbd34025c3005d2ac87934519.jfif", alt: "Board Game 2" },
  { src: "/game/box_sheriff_0_TH_400x2x.png", alt: "Sheriff of Nottingham" },
  { src: "/game/Dixit-1.png", alt: "Dixit" },
  { src: "/game/en_280.png", alt: "Board Game 5" },
  { src: "/game/f8xm4d.png", alt: "Board Game 6" },
  { src: "/game/ighig7.png", alt: "Board Game 7" },
  { src: "/game/image.png", alt: "Board Game 8" },
  { src: "/game/qwap6i.png", alt: "Board Game 9" },
  { src: "/game/TwoRoomsandaBoom.png", alt: "Two Rooms and a Boom" },
];

const tables = [
  {
    id: 1,
    name: "โต๊ะ 1",
    image: "/table/1.jpg",
    pricePerPerson: 40,
    capacity: 8,
  },
  {
    id: 2,
    name: "โต๊ะ 2",
    image: "/table/2.jpg",
    pricePerPerson: 40,
    capacity: 8,
  },
  {
    id: 3,
    name: "โต๊ะ 3",
    image: "/table/3.jpg",
    pricePerPerson: 40,
    capacity: 8,
  },
  {
    id: 4,
    name: "โต๊ะ 4",
    image: "/table/4.jpg",
    pricePerPerson: 40,
    capacity: 8,
  },
  {
    id: 5,
    name: "โต๊ะ 5",
    image: "/table/5.jpg",
    pricePerPerson: 40,
    capacity: 8,
  },
  {
    id: 6,
    name: "โต๊ะ 6",
    image: "/table/6.jpg",
    pricePerPerson: 40,
    capacity: 8,
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
    name: "MaMa Cup",
    price: 20,
    image: "https://freshourmarket.com/cdn/shop/files/9032014_f546dd35-a6e2-4196-ac1c-08b0cd858c3b.jpg?v=1720699456",
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
    image: "https://clean-2lean.com/wp-content/uploads/2024/01/3.jpg",
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ id: 0, name: "", type: 'table' as 'table' | 'game' });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const { user, role, signOut } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const handleBooking = (id: number, name: string, type: 'table' | 'game') => {
    if (!user) {
      toast.info("กรุณาเข้าสู่ระบบก่อนจองโต๊ะ");
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedItem({ id, name, type });
    setIsBookingModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("ออกจากระบบแล้ว");
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="bg-card shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/305348491_476807741121931_685029175630906297_n.jpg" alt="Doodle" className="w-10 h-10 object-contain dark:invert" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Doodle Boardgame Cafe
                </h1>
                <p className="text-sm text-muted-foreground">คาเฟ่บอร์ดเกม บางแสน</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" size="sm" asChild><a href="#tables">โต๊ะ</a></Button>
              <Button variant="ghost" size="sm" onClick={() => setIsScheduleOpen(true)}>ตารางเวลา</Button>
              <Button variant="ghost" size="sm" asChild><a href="#menu">เมนู</a></Button>
              <Button variant="ghost" size="sm" asChild><a href="#facilities">สิ่งอำนวยความสะดวก</a></Button>
              <Button variant="ghost" size="sm" asChild><a href="#pricing">ราคา</a></Button>
              <Button variant="ghost" size="sm" asChild><a href="#contact">ติดต่อ</a></Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              {user ? (
                <div className="flex items-center gap-1 ml-2">
                  {role === "admin" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAdminOpen(true)}
                      className="text-amber-600 hover:text-amber-800 gap-1 font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMyBookingsOpen(true)}
                    className="gap-1"
                  >
                    <CalendarDays className="w-4 h-4" />
                    การจองของฉัน
                  </Button>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground px-2">
                    <User className="w-4 h-4" />
                    {user.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-destructive gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    ออกจากระบบ
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1 text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  เข้าสู่ระบบ
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] bg-background border-b border-border">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
          <img src="/305348491_476807741121931_685029175630906297_n.jpg" alt="Doodle Boardgame and Cafe" className="w-64 h-64 object-contain mb-6 dark:invert" />
          <h2 className="text-5xl font-bold text-foreground mb-4">
            Doodle Boardgame Cafe
          </h2>
          <p className="text-2xl text-muted-foreground mb-2">
            จองโต๊ะและบอร์ดเกม
          </p>
          <p className="text-xl text-muted-foreground/70 mb-8 max-w-2xl">
            บอร์ดเกมกว่า 300+ เกม พร้อมเครื่องดื่มและอาหาร
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <a href="#tables">จองโต๊ะ</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Game Carousel Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-2 text-center">
              บอร์ดเกมของเรา
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              บอร์ดเกมหลากหลายประเภทให้เลือกเล่น
            </p>
          </div>
          <Carousel opts={{ align: "start", loop: true }} className="w-full mx-auto">
            <CarouselContent className="-ml-4">
              {gameImages.map((img, index) => (
                <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Card className="overflow-hidden aspect-square flex items-center justify-center p-4 shadow-md">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="max-w-full max-h-full object-contain"
                    />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Tables Section */}
        <section id="tables" className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-2 text-center">
              โต๊ะของเรา
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              เลือกโต๊ะที่เหมาะกับกลุ่มของคุณ พร้อมสิ่งอำนวยความสะดวกครบครัน
            </p>
            <div className="flex justify-center mb-6">
              <Button
                variant="secondary"
                onClick={() => setIsScheduleOpen(true)}
                className="flex items-center gap-2"
              >
                <CalendarDays className="w-5 h-5" />
                ดูตารางเวลาว่าง
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tables.map((table) => (
              <TableCard key={table.id} {...table} onBook={handleBooking} />
            ))}
          </div>
        </section>

        {/* Facilities Section */}
        <section id="facilities" className="mb-16 bg-card rounded-lg shadow-md p-8 border border-border">
          <h2 className="text-4xl font-bold text-foreground mb-8 text-center">
            สิ่งอำนวยความสะดวก
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Coffee className="w-10 h-10 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">เครื่องดื่มและอาหาร</h3>
              <p className="text-muted-foreground text-sm">
                เครื่องดื่ม พร้อมและอาหารว่าง
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Wifi className="w-10 h-10 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Wi-Fi ฟรี</h3>
              <p className="text-muted-foreground text-sm">
                Wi-Fi ฟรี สำหรับลูกค้าที่มาใช้บริการ
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">พนักงานแนะนำ</h3>
              <p className="text-muted-foreground text-sm">
                มีพนักงานคอยแนะนำและสอนวิธีเล่นเกม
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Gamepad2 className="w-10 h-10 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">300+ เกม</h3>
              <p className="text-muted-foreground text-sm">
                บอร์ดเกมหลากหลายประเภทกว่า 300+ เกม
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Clock className="w-10 h-10 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">เปิด จันทร์-อาทิตย์</h3>
              <p className="text-muted-foreground text-sm">
                เปิดบริการ จันทร์-อาทิตย์ 14:00-24:00 น.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mb-16">
          <div className="rounded-lg shadow-sm p-8 border border-border">
            <h2 className="text-4xl font-bold mb-6 text-center text-foreground">
              ราคาและโปรโมชั่น
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">รายชั่วโมง</div>
                <h3 className="font-semibold text-xl mb-4 text-foreground">ค่าที่นั่ง</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <p className="text-4xl font-bold text-foreground">฿40</p>
                  <p className="text-sm text-muted-foreground">/ คน / ชั่วโมง</p>
                </div>
                <Separator className="my-4" />
                <p className="text-sm mb-3 font-medium text-foreground">ตัวอย่างการคิดราคา:</p>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex justify-between"><span>1 ชม.</span><span className="font-semibold text-foreground">฿40 / คน</span></div>
                  <div className="flex justify-between"><span>2 ชม.</span><span className="font-semibold text-foreground">฿80 / คน</span></div>
                  <div className="flex justify-between"><span>3 ชม.</span><span className="font-semibold text-foreground">฿120 / คน</span></div>
                </div>
                <Separator className="my-4" />
                <ul className="space-y-2 text-sm text-foreground">
                  <li>✓ เหมาะสำหรับเล่นเกมสั้นๆ</li>
                  <li>✓ มีพนักงานแนะนำเกม</li>
                </ul>
              </div>
              <div className="bg-card border-2 border-primary rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">คุ้มสุด!</div>
                <div className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">เหมาจ่าย</div>
                <h3 className="font-semibold text-xl mb-4 text-foreground">มากกว่า 3 ชั่วโมง</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <p className="text-4xl font-bold text-foreground">฿120</p>
                  <p className="text-sm text-muted-foreground">/ คน / ทั้งวัน</p>
                </div>
                <Separator className="my-4" />
                <p className="text-sm mb-3 font-medium text-foreground">เปรียบเทียบ:</p>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex justify-between"><span>จ่ายรายชม. 4 ชม.</span><span className="line-through">฿160</span></div>
                  <div className="flex justify-between"><span>จ่ายรายชม. 5 ชม.</span><span className="line-through">฿200</span></div>
                  <div className="flex justify-between font-bold text-foreground"><span>เหมาทั้งวัน</span><span className="text-green-600">฿120 เท่านั้น!</span></div>
                </div>
                <Separator className="my-4" />
                <ul className="space-y-2 text-sm text-foreground">
                  <li>✓ เล่นได้ทั้งวัน (14:00-24:00)</li>
                  <li>✓ ประหยัดกว่ารายชั่วโมง</li>
                  <li>✓ เหมาะสำหรับเกมยาวๆ</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-2 text-center">
              เมนูอาหารและเครื่องดื่ม
            </h2>
            <p className="text-muted-foreground text-center mb-6">
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
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm mb-1 text-foreground">{item.name}</h3>
                      <p className="text-foreground font-bold">฿{item.price}</p>
                      {item.extras && (
                        <p className="text-xs text-muted-foreground mt-1">
                          + {item.extras[0].name} ฿{item.extras[0].price}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="food" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {menuItems.filter(item => item.category === 'food').map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm mb-1 text-foreground">{item.name}</h3>
                      <p className="text-foreground font-bold">฿{item.price}</p>
                      {item.extras && (
                        <p className="text-xs text-muted-foreground mt-1">
                          + {item.extras[0].name} ฿{item.extras[0].price}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="drink" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {menuItems.filter(item => item.category === 'drink').map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm mb-1 text-foreground">{item.name}</h3>
                      <p className="text-foreground font-bold">฿{item.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted text-foreground mt-16 border-t border-border" id="contact">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <Gamepad2 className="w-6 h-6" />
                Doodle Boardgame Cafe
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                คาเฟ่บอร์ดเกมครบวงจรในบางแสน ชลบุรี
                มีบอร์ดเกมให้เลือกเล่นมากกว่า 300+ เกม
                พร้อมเครื่องดื่มและอาหาร บรรยากาศสบาย
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-4">ติดต่อเรา</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>6/52 ถ.บางแสนสาย4ใต้ ต.แสนสุข อ.เมือง จ.ชลบุรี bang saen 20130 Thailand, Bang Saen, Thailand, Chon Buri</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>080 574 9007</span>
                </div>
                <div className="flex items-center gap-2">
                  <Facebook className="w-5 h-5" />
                  <a href="https://www.facebook.com/share/1GjwGJiGP8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Doodle Boardgame Cafe</a>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-4">เวลาทำการ</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>จันทร์-อาทิตย์: 14.00-24.00 น.</p>
                <p className="pt-3 text-foreground/90">
                  💡 แนะนำจองล่วงหน้าช่วงวันหยุด
                </p>
                <p className="pt-3">
                  <a href="#tables" className="text-muted-foreground hover:text-foreground transition-colors">
                    → จองโต๊ะและบอร์ดเกมออนไลน์
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
            © 2026 Doodle Boardgame Cafe. สงวนลิขสิทธิ์.
          </div>
        </div>
      </footer>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tableName={selectedItem.name}
        menuItems={menuItems}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <ScheduleView
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        isAdmin={role === "admin"}
      />
    </div>
  );
}