const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    const { error } = await supabase.from("bookings").select("id").limit(1);
    if (error) throw error;
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Create booking
app.post("/api/bookings", async (req, res) => {
  const { customer_name, phone, booking_date, booking_time, hours, guests, table_name } = req.body;

  if (!customer_name || !phone || !booking_date || !booking_time || !hours || !guests || !table_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check for overlapping bookings
    const { data: existing } = await supabase
      .from("bookings")
      .select("booking_time, hours")
      .eq("booking_date", booking_date)
      .eq("table_name", table_name);

    if (existing && existing.length > 0) {
      const [h, m] = booking_time.split(":").map(Number);
      const newStart = h * 60 + m;
      const newEnd = newStart + Number(hours) * 60;
      const overlap = existing.some((b) => {
        const [bh, bm] = b.booking_time.split(":").map(Number);
        const bStart = bh * 60 + bm;
        const bEnd = bStart + (b.hours || 2) * 60;
        return newStart < bEnd && newEnd > bStart;
      });
      if (overlap) {
        return res.status(409).json({ error: "ช่วงเวลานี้มีการจองแล้ว กรุณาเลือกเวลาอื่น" });
      }
    }

    const { data, error } = await supabase.from("bookings").insert({
      customer_name,
      phone,
      booking_date,
      booking_time,
      hours: Number(hours),
      guests: Number(guests),
      table_name,
    }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Get all bookings
app.get("/api/bookings", async (_req, res) => {
  try {
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Sign up user (admin API - auto confirm, no email)
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    res.status(201).json({ user: data.user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
