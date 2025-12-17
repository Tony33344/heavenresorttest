# SUPABASE MANUAL SETUP STEPS

## You need to do these steps in the Supabase Dashboard:

### 1. Enable Email Auth and Disable Email Confirmation

Go to: https://supabase.com/dashboard/project/hzomlbebmlipbxcqqjjf/auth/providers

1. Click on **Email** provider
2. **Enable Email provider** (should be ON)
3. **Disable "Confirm email"** - Set to OFF
   - This allows users to sign up without email verification
   - Good for testing and development
4. Click **Save**

### 2. Configure Site URL

Go to: https://supabase.com/dashboard/project/hzomlbebmlipbxcqqjjf/auth/url-configuration

1. Set **Site URL** to: `https://heaven-resort.netlify.app`
2. Add **Redirect URLs**:
   - `https://heaven-resort.netlify.app/auth/callback`
   - `https://heaven-resort.netlify.app/admin`
   - `http://localhost:3000/auth/callback` (for local development)
3. Click **Save**

### 3. Create First Admin User

Go to: https://supabase.com/dashboard/project/hzomlbebmlipbxcqqjjf/auth/users

1. Click **Add user** → **Create new user**
2. Enter:
   - Email: `admin@test.com`
   - Password: `AdminPass123`
   - Auto Confirm User: **YES** (check this box)
3. Click **Create user**

### 4. Verify Database Tables

Go to: https://supabase.com/dashboard/project/hzomlbebmlipbxcqqjjf/editor

1. Check that these tables exist:
   - `bookings`
   - `contact_messages`
2. Check that RLS is enabled (green shield icon)

### 5. Verify RLS Policies

Go to: https://supabase.com/dashboard/project/hzomlbebmlipbxcqqjjf/auth/policies

1. For `contact_messages` table:
   - Should have policy allowing INSERT for `anon` role
   - Should have policies allowing SELECT/UPDATE for `authenticated` role

2. For `bookings` table:
   - Should have policy allowing INSERT for `authenticated` role
   - Should have policies allowing SELECT/UPDATE/DELETE for `authenticated` role

---

## After completing these steps, the system will work as follows:

1. **Public visitors** can submit contact inquiries (no login)
2. **Registered users** can sign up, login, and create bookings
3. **Admin users** can view all bookings and inquiries in the admin dashboard

## Test Credentials:
- Email: `admin@test.com`
- Password: `AdminPass123`
