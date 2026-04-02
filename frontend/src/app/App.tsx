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
import { Badge } from "./components/ui/badge";
import { MapPin, Phone, Facebook, Gamepad2, Coffee, Users, Wifi, Clock, LogIn, LogOut, User, CalendarDays, Shield, Moon, Sun, ChevronRight, Check, Menu, X } from "lucide-react";
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
  { id: 1, name: "โต๊ะ 1", image: "/table/1.jpg", pricePerPerson: 40, capacity: 8 },
  { id: 2, name: "โต๊ะ 2", image: "/table/2.jpg", pricePerPerson: 40, capacity: 8 },
  { id: 3, name: "โต๊ะ 3", image: "/table/3.jpg", pricePerPerson: 40, capacity: 8 },
  { id: 4, name: "โต๊ะ 4", image: "/table/4.jpg", pricePerPerson: 40, capacity: 8 },
  { id: 5, name: "โต๊ะ 5", image: "/table/5.jpg", pricePerPerson: 40, capacity: 8 },
  { id: 6, name: "โต๊ะ 6", image: "/table/6.jpg", pricePerPerson: 40, capacity: 8 },
];

const menuItems = [
  {
    id: 1, name: "French Fries", price: 40,
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBmcmllc3xlbnwxfHx8fDE3NzMxMzE0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "food", extras: [{ name: "Cheese Dip", price: 15 }],
  },
  {
    id: 2, name: "MaMa Cup", price: 20,
    image: "https://freshourmarket.com/cdn/shop/files/9032014_f546dd35-a6e2-4196-ac1c-08b0cd858c3b.jpg?v=1720699456",
    category: "food",
  },
  {
    id: 3, name: "Twining Tea", price: 40,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWElMjBjdXB8ZW58MXx8fHwxNzczMTMxNDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "drink",
  },
  {
    id: 4, name: "Coca Cola", price: 20,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NhJTIwY29sYXxlbnwxfHx8fDE3NzMxMzE0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "drink",
  },
  {
    id: 5, name: "SinghSoda", price: 20,
    image: "https://clean-2lean.com/wp-content/uploads/2024/01/3.jpg",
    category: "drink",
  },
  {
    id: 6, name: "Water", price: 10,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZXxlbnwxfHx8fDE3NzMxMzE0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "drink",
  },
];

const facilities = [
  { icon: Coffee, title: "เครื่องดื่มและอาหาร", desc: "เครื่องดื่มพร้อมอาหารว่าง" },
  { icon: Wifi, title: "Wi-Fi ฟรี", desc: "อินเทอร์เน็ตไร้สายสำหรับลูกค้า" },
  { icon: Users, title: "พนักงานแนะนำ", desc: "คอยแนะนำและสอนวิธีเล่นเกม" },
  { icon: Gamepad2, title: "300+ เกม", desc: "บอร์ดเกมหลากหลายประเภท" },
  { icon: Clock, title: "เปิดทุกวัน", desc: "จันทร์–เสาร์ 14:00–24:00 น." },
];

function MenuCard({ item }: { item: typeof menuItems[number] }) {
  return (
    <Card className="overflow-hidden group">
      <div className="aspect-square overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <CardContent className="p-3">
        <p className="font-medium text-sm">{item.name}</p>
        <p className="text-sm text-muted-foreground">฿{item.price}</p>
        {item.extras && (
          <p className="text-xs text-muted-foreground mt-0.5">+ {item.extras[0].name} ฿{item.extras[0].price}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ id: 0, name: "", type: 'table' as 'table' | 'game' });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <a href="#" className="flex items-center gap-2">
            <img src="/305348491_476807741121931_685029175630906297_n.jpg" alt="Doodle" className="h-8 w-8 object-contain dark:invert" />
            <span className="font-semibold tracking-tight">Doodle Boardgame Cafe</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild><a href="#tables">โต๊ะ</a></Button>
            <Button variant="ghost" size="sm" onClick={() => setIsScheduleOpen(true)}>ตารางเวลา</Button>
            <Button variant="ghost" size="sm" asChild><a href="#menu">เมนู</a></Button>
            <Button variant="ghost" size="sm" asChild><a href="#pricing">ราคา</a></Button>
            <Button variant="ghost" size="sm" asChild><a href="#contact">ติดต่อ</a></Button>
            <Separator orientation="vertical" className="mx-1 h-5" />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {user ? (
              <>
                {role === "admin" && (
                  <Button variant="ghost" size="sm" onClick={() => setIsAdminOpen(true)} className="gap-1.5 text-amber-600">
                    <Shield className="h-3.5 w-3.5" /> Admin
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsMyBookingsOpen(true)} className="gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> การจองของฉัน
                </Button>
                <span className="text-xs text-muted-foreground px-2 hidden lg:inline">{user.email}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5 text-muted-foreground">
                  <LogOut className="h-3.5 w-3.5" /> ออก
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setIsAuthModalOpen(true)} className="gap-1.5">
                <LogIn className="h-3.5 w-3.5" /> เข้าสู่ระบบ
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background/95 backdrop-blur-md">
          <nav className="container mx-auto flex flex-col px-4 py-3 gap-1">
            <Button variant="ghost" size="sm" className="justify-start" asChild onClick={() => setMobileMenuOpen(false)}><a href="#tables">โต๊ะ</a></Button>
            <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setIsScheduleOpen(true); setMobileMenuOpen(false); }}>ตารางเวลา</Button>
            <Button variant="ghost" size="sm" className="justify-start" asChild onClick={() => setMobileMenuOpen(false)}><a href="#menu">เมนู</a></Button>
            <Button variant="ghost" size="sm" className="justify-start" asChild onClick={() => setMobileMenuOpen(false)}><a href="#pricing">ราคา</a></Button>
            <Button variant="ghost" size="sm" className="justify-start" asChild onClick={() => setMobileMenuOpen(false)}><a href="#contact">ติดต่อ</a></Button>
            <Separator className="my-1" />
            {user ? (
              <>
                {role === "admin" && (
                  <Button variant="ghost" size="sm" className="justify-start gap-1.5 text-amber-600" onClick={() => { setIsAdminOpen(true); setMobileMenuOpen(false); }}>
                    <Shield className="h-3.5 w-3.5" /> Admin
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="justify-start gap-1.5" onClick={() => { setIsMyBookingsOpen(true); setMobileMenuOpen(false); }}>
                  <CalendarDays className="h-3.5 w-3.5" /> การจองของฉัน
                </Button>
                <p className="text-xs text-muted-foreground px-3 py-1">{user.email}</p>
                <Button variant="ghost" size="sm" className="justify-start gap-1.5 text-muted-foreground" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}>
                  <LogOut className="h-3.5 w-3.5" /> ออกจากระบบ
                </Button>
              </>
            ) : (
              <Button size="sm" className="justify-start gap-1.5" onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}>
                <LogIn className="h-3.5 w-3.5" /> เข้าสู่ระบบ
              </Button>
            )}
          </nav>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b">
        <div className="container mx-auto flex flex-col items-center px-4 py-14 sm:py-24 text-center">
          <img src="/305348491_476807741121931_685029175630906297_n.jpg" alt="Doodle" className="h-24 w-24 sm:h-40 sm:w-40 object-contain mb-6 sm:mb-8 dark:invert" />
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
            Doodle Boardgame Cafe
          </h1>
          <p className="text-lg text-muted-foreground mb-2">คาเฟ่บอร์ดเกม บางแสน</p>
          <p className="text-muted-foreground max-w-md mb-8">
            บอร์ดเกมกว่า 300+ เกม พร้อมเครื่องดื่มและอาหารว่าง ในบรรยากาศสบายๆ
          </p>
          <div className="flex gap-3">
            <Button size="lg" asChild>
              <a href="#tables" className="gap-2">จองโต๊ะ <ChevronRight className="h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setIsScheduleOpen(true)}>
              ดูตารางเวลา
            </Button>
          </div>
        </div>
      </section>

      <main>
        {/* ── Board Games ── */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <div className="text-center mb-8 sm:mb-10">
            <Badge variant="secondary" className="mb-3">Board Games</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">บอร์ดเกมของเรา</h2>
            <p className="text-muted-foreground mt-2">หลากหลายประเภทให้เลือกเล่น</p>
          </div>
          <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-5xl mx-auto">
            <CarouselContent className="-ml-3">
              {gameImages.map((img, i) => (
                <CarouselItem key={i} className="pl-3 basis-1/2 md:basis-1/3 lg:basis-1/5">
                  <Card className="overflow-hidden">
                    <div className="aspect-square flex items-center justify-center p-4 bg-muted/30">
                      <img src={img.src} alt={img.alt} className="max-w-full max-h-full object-contain" />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* ── Tables ── */}
        <section id="tables" className="border-t">
          <div className="container mx-auto px-4 py-12 sm:py-20">
            <div className="text-center mb-8 sm:mb-10">
              <Badge variant="secondary" className="mb-3">Tables</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">โต๊ะของเรา</h2>
              <p className="text-muted-foreground mt-2">เลือกโต๊ะที่เหมาะกับกลุ่มของคุณ</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {tables.map((table) => (
                <TableCard key={table.id} {...table} onBook={handleBooking} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Facilities ── */}
        <section id="facilities" className="border-t bg-muted/40">
          <div className="container mx-auto px-4 py-12 sm:py-20">
            <div className="text-center mb-8 sm:mb-10">
              <Badge variant="secondary" className="mb-3">Facilities</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">สิ่งอำนวยความสะดวก</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {facilities.map((f) => (
                <div key={f.title} className="flex flex-col items-center text-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background border">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="border-t">
          <div className="container mx-auto px-4 py-12 sm:py-20">
            <div className="text-center mb-8 sm:mb-10">
              <Badge variant="secondary" className="mb-3">Pricing</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">ราคาและโปรโมชั่น</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Hourly */}
              <Card className="p-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">รายชั่วโมง</p>
                <h3 className="font-semibold text-lg mb-4">ค่าที่นั่ง</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">฿40</span>
                  <span className="text-sm text-muted-foreground">/ คน / ชั่วโมง</span>
                </div>
                <Separator className="my-4" />
                <p className="text-sm font-medium mb-2">ตัวอย่าง:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between"><span>1 ชม.</span><span className="font-medium text-foreground">฿40</span></div>
                  <div className="flex justify-between"><span>2 ชม.</span><span className="font-medium text-foreground">฿80</span></div>
                  <div className="flex justify-between"><span>3 ชม.</span><span className="font-medium text-foreground">฿120</span></div>
                </div>
                <Separator className="my-4" />
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-muted-foreground" /> เหมาะสำหรับเกมสั้นๆ</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-muted-foreground" /> มีพนักงานแนะนำเกม</li>
                </ul>
              </Card>

              {/* All-day */}
              <Card className="p-6 border-2 border-primary relative">
                <Badge className="absolute top-4 right-4">คุ้มสุด</Badge>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">เหมาจ่าย</p>
                <h3 className="font-semibold text-lg mb-4">มากกว่า 3 ชั่วโมง</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">฿120</span>
                  <span className="text-sm text-muted-foreground">/ คน / ทั้งวัน</span>
                </div>
                <Separator className="my-4" />
                <p className="text-sm font-medium mb-2">เปรียบเทียบ:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between"><span>4 ชม. รายชั่วโมง</span><span className="line-through">฿160</span></div>
                  <div className="flex justify-between"><span>5 ชม. รายชั่วโมง</span><span className="line-through">฿200</span></div>
                  <div className="flex justify-between font-medium text-foreground"><span>เหมาทั้งวัน</span><span className="text-green-600">฿120</span></div>
                </div>
                <Separator className="my-4" />
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> เล่นได้ทั้งวัน 14:00–24:00</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> ประหยัดกว่ารายชั่วโมง</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> เหมาะสำหรับเกมยาวๆ</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* ── Menu ── */}
        <section id="menu" className="border-t bg-muted/40">
          <div className="container mx-auto px-4 py-12 sm:py-20">
            <div className="text-center mb-8 sm:mb-10">
              <Badge variant="secondary" className="mb-3">Menu</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">เมนูอาหารและเครื่องดื่ม</h2>
              <p className="text-muted-foreground mt-2">สั่งล่วงหน้าได้ตอนจองโต๊ะ</p>
            </div>

            <Tabs defaultValue="all" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full max-w-xs mx-auto grid-cols-3 mb-8">
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="food">อาหาร</TabsTrigger>
                <TabsTrigger value="drink">เครื่องดื่ม</TabsTrigger>
              </TabsList>

              {["all", "food", "drink"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {(tab === "all" ? menuItems : menuItems.filter((m) => m.category === tab)).map((item) => (
                      <MenuCard key={item.id} item={item} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t" id="contact">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" /> Doodle Boardgame Cafe
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                คาเฟ่บอร์ดเกมครบวงจรในบางแสน ชลบุรี บอร์ดเกม 300+ เกม พร้อมเครื่องดื่มและอาหาร
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">ติดต่อเรา</h3>
              <div className="space-y-2.5 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>6/52 ถ.บางแสนสาย4ใต้ ต.แสนสุข อ.เมือง จ.ชลบุรี 20130</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>080 574 9007</span>
                </div>
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 shrink-0" />
                  <a href="https://www.facebook.com/share/1GjwGJiGP8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Doodle Boardgame Cafe</a>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">เวลาทำการ</h3>
              <div className="text-sm text-muted-foreground space-y-1.5">
                <p>จันทร์–เสาร์: 14:00–24:00 น.</p>
                <p>อาทิตย์: ปิดทำการ</p>
                <p className="pt-2 text-xs">แนะนำจองล่วงหน้าช่วงวันหยุด</p>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="text-center text-xs text-muted-foreground">
            © 2026 Doodle Boardgame Cafe. สงวนลิขสิทธิ์.
          </p>
        </div>
      </footer>

      {/* ── Modals ── */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tableName={selectedItem.name}
        menuItems={menuItems}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <MyBookingsModal isOpen={isMyBookingsOpen} onClose={() => setIsMyBookingsOpen(false)} />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <ScheduleView isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} isAdmin={role === "admin"} />
    </div>
  );
}