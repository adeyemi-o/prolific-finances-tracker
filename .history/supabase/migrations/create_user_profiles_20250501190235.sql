-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active'
);

-- Create security policies for RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for allowing users to read all profiles
CREATE POLICY "Users can view all profiles" 
  ON user_profiles FOR SELECT 
  USING (true);

-- Policy for allowing users to update only their own profile
CREATE POLICY "Users can update their own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, user_metadata, created_at)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically add new users to user_profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users into the user_profiles table
INSERT INTO public.user_profiles (id, email, user_metadata, created_at)
SELECT id, email, raw_user_meta_data, created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;