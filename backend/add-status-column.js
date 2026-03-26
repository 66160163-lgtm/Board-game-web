const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function run() {
  // Try to update a row with status to test if column exists
  const { data: testData, error: testErr } = await supabase
    .from("bookings")
    .select("id")
    .limit(1);

  // Try adding column by updating with status field
  const { error } = await supabase.rpc("exec_sql", {
    query: "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';"
  });

  if (error) {
    console.log("RPC not available, trying direct approach...");
    // Alternative: just try to read status column
    const { data, error: readErr } = await supabase
      .from("bookings")
      .select("id, status")
      .limit(1);

    if (readErr) {
      console.log("Status column does not exist yet. Please run this SQL in Supabase dashboard:");
      console.log("ALTER TABLE bookings ADD COLUMN status text DEFAULT 'pending';");
    } else {
      console.log("Status column already exists:", data);
    }
  } else {
    console.log("Column added successfully");
  }
}

run();
