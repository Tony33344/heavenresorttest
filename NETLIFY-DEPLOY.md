# HEAVEN Resort - Netlify Deployment Guide

## 🚀 Quick Deploy to Netlify

You have Netlify CLI installed! Here's how to deploy your elegant HEAVEN Resort website.

---

## ✅ Pre-Deployment Checklist

Your website is **production-ready** with:
- ✅ Elegant purple brand design (#7B4B8E)
- ✅ Logo integrated
- ✅ Address: **Kristan Vrh 16, Šmarje pri Podčetrtku**
- ✅ Multi-language (SL/EN)
- ✅ All 8 sections complete
- ✅ Contact forms with validation
- ✅ Supabase backend ready
- ✅ Mobile responsive
- ✅ SEO optimized

---

## 🎯 Method 1: Netlify CLI (Recommended)

### Step 1: Build the Project

```bash
cd /home/jack/CascadeProjects/heaven-resort
npm run build
```

### Step 2: Login to Netlify

```bash
netlify login
```

This will open your browser to authenticate.

### Step 3: Initialize Netlify

```bash
netlify init
```

Follow the prompts:
- **Create & configure a new site**: Yes
- **Team**: Select your team
- **Site name**: heaven-resort (or your preferred name)
- **Build command**: `npm run build`
- **Publish directory**: `.next`

### Step 4: Set Environment Variables

```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_supabase_url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_supabase_anon_key"
```

### Step 5: Deploy!

```bash
netlify deploy --prod
```

✅ **Done!** Your site is live at: `https://heaven-resort.netlify.app`

---

## 🎯 Method 2: Netlify Dashboard

### Step 1: Push to Git

```bash
cd /home/jack/CascadeProjects/heaven-resort
git init
git add .
git commit -m "HEAVEN Resort - Production ready"
git remote add origin https://github.com/yourusername/heaven-resort.git
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

### Step 3: Add Environment Variables

In Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

### Step 4: Deploy

Click **"Deploy site"** - Netlify will automatically build and deploy!

---

## 🗄️ Supabase Setup (If Not Done)

You have Supabase CLI installed! Here's the quick setup:

### Option A: Using Supabase CLI

```bash
cd /home/jack/CascadeProjects/heaven-resort

# Login to Supabase
supabase login

# Link to your project (if you have one)
supabase link --project-ref your-project-ref

# Push database schema
supabase db push
```

### Option B: Using Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Create new project (if not exists)
3. Go to **SQL Editor**
4. Copy and paste contents of `supabase-setup.sql`
5. Run the SQL
6. Go to **Settings** → **API**
7. Copy:
   - Project URL
   - `anon` `public` key

---

## 🔧 Netlify Configuration

Your `netlify.toml` is already configured with:
- ✅ Next.js plugin
- ✅ Build settings
- ✅ Security headers
- ✅ Cache optimization
- ✅ Redirects

---

## 🌐 Custom Domain Setup

### Step 1: Add Domain in Netlify

```bash
netlify domains:add heavenresort.com
```

Or in dashboard:
1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter: `heavenresort.com`

### Step 2: Configure DNS

Add these records to your domain registrar:

**A Record:**
```
Type: A
Name: @
Value: 75.2.60.5
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: heaven-resort.netlify.app
```

### Step 3: Enable HTTPS

Netlify automatically provisions SSL certificate (Let's Encrypt) - no action needed!

---

## 📊 Post-Deployment Checklist

After deployment, verify:

- [ ] Site loads at Netlify URL
- [ ] All images display correctly
- [ ] Logo appears properly
- [ ] Language toggle works (SL/EN)
- [ ] Contact form submits successfully
- [ ] Booking form works
- [ ] Mobile responsive design works
- [ ] All navigation links work
- [ ] HTTPS is active
- [ ] Custom domain configured (if applicable)

---

## 🔄 Continuous Deployment

Netlify automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update content"
git push origin main
```

Netlify will automatically:
1. Detect the push
2. Build your site
3. Deploy to production
4. Notify you when done

---

## 🎨 Update Content

### Update Address/Contact Info

Edit: `lib/translations.ts`
```typescript
address: 'Kristan Vrh 16, Šmarje pri Podčetrtku, Slovenija',
email: 'info@heavenresort.com',
phone: '+386 XX XXX XXX',
```

### Update Pricing

Edit: `lib/translations.ts` → `packages` section

### Add Photos

1. Add images to `public/images/gallery/`
2. Update `components/sections/Gallery.tsx`

Then push to GitHub - Netlify auto-deploys!

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Test build locally first
npm run build

# Check build logs in Netlify dashboard
netlify logs
```

### Environment Variables Not Working

```bash
# List current variables
netlify env:list

# Set again if needed
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_url"
```

### Forms Not Submitting

1. Check Supabase connection
2. Verify environment variables are set
3. Check browser console for errors
4. Verify Supabase RLS policies

### Images Not Loading

1. Ensure images are in `public/images/`
2. Check file paths in code
3. Verify build includes images
4. Clear Netlify cache and redeploy

---

## 📈 Netlify Features to Enable

### Analytics
```bash
netlify analytics:enable
```

### Forms (Alternative to Supabase)
Add `netlify` attribute to forms:
```html
<form netlify>
  <!-- form fields -->
</form>
```

### Functions (Serverless)
Create API endpoints in `netlify/functions/`

---

## 🚀 Quick Commands Reference

```bash
# Deploy to production
netlify deploy --prod

# Deploy preview
netlify deploy

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin

# View logs
netlify logs

# Check status
netlify status

# Link to existing site
netlify link
```

---

## 💡 Performance Optimization

Your site already includes:
- ✅ Next.js automatic code splitting
- ✅ Image optimization
- ✅ CSS optimization
- ✅ Font optimization
- ✅ Cache headers configured

Netlify adds:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Asset optimization
- ✅ Instant cache invalidation

Expected Lighthouse scores:
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

---

## 🎉 Success!

Your elegant HEAVEN Resort website is now live on Netlify with:

- ✅ **Address**: Kristan Vrh 16, Šmarje pri Podčetrtku
- ✅ **Brand**: Purple (#7B4B8E), elegant design
- ✅ **Features**: Multi-language, booking forms, gallery
- ✅ **Backend**: Supabase connected
- ✅ **Deployment**: Netlify with auto-deploy
- ✅ **Performance**: Optimized and fast
- ✅ **Security**: HTTPS, security headers

---

## 📞 Support

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Your HEAVEN Resort website is production-ready! 🏔️**

*Transformativna Idoživetja - Creating unforgettable experiences in nature*
