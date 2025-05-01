-- Create a safe view for accessing user information
CREATE OR REPLACE VIEW users_view AS
SELECT 
  id,
  email,
  raw_user_meta_data AS user_metadata,
  created_at,
  last_sign_in_at,
  email_confirmed_at,
  confirmed_at
FROM auth.users;

-- Create a function to get users with permission check
CREATE OR REPLACE FUNCTION get_users_with_permission()
RETURNS SETOF users_view AS $$
BEGIN
  -- Check if user has admin role
  IF (current_setting('request.jwt.claims', true)::json->>'role' = 'Admin') THEN
    RETURN QUERY SELECT * FROM users_view;
  ELSE
    -- Only return the current user's data
    RETURN QUERY SELECT * FROM users_view WHERE id = auth.uid();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;