-- =============================================================
-- 1. Leaked Password Protection
-- =============================================================
-- This CANNOT be done via SQL. You must enable it in:
--   Supabase Dashboard → Authentication → Auth Providers → Email
--   → Toggle ON "Leaked password protection"
--
-- This checks passwords against HaveIBeenPwned.org on sign-up
-- and password changes.


-- =============================================================
-- 2. Fix profiles INSERT RLS policy (replace always-true)
-- =============================================================
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;

-- Users may only insert their own profile row
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);


-- =============================================================
-- 3. Fix handle_new_user search_path
-- =============================================================
-- Set an immutable search_path to prevent search_path hijacking.
-- The function is recreated to include SET search_path.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;
