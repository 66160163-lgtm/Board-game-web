-- Enable Row Level Security on public.bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Helper: check if the current user has the 'admin' role in profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 1. SELECT: anyone (anon + authenticated) can read all bookings
--    Needed for: schedule view, overlap checking, "my bookings"
CREATE POLICY "Anyone can view bookings"
  ON public.bookings
  FOR SELECT
  USING (true);

-- 2. INSERT: only logged-in users can create a booking
CREATE POLICY "Authenticated users can create bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3. UPDATE: only admins can update bookings (toggle status)
CREATE POLICY "Admins can update bookings"
  ON public.bookings
  FOR UPDATE
  USING (public.is_admin());

-- 4. DELETE: only admins can delete bookings
CREATE POLICY "Admins can delete bookings"
  ON public.bookings
  FOR DELETE
  USING (public.is_admin());
