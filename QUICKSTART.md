# HEAVEN Resort - Quick Start Guide

Get your website running in 5 minutes! 🚀

## ⚡ Instant Start (Already Done!)

The development server is already running at:
**http://localhost:3000**

Open your browser and visit the URL to see your website!

---

## 🎨 What You're Seeing

Your website includes:

1. **Hero Section** - Full-screen with HEAVEN Resort logo
2. **About** - Information about the resort
3. **Venue Features** - Indoor/outdoor spaces
4. **Events** - Weddings, corporate, workshops
5. **Accommodation** - Room and camping details
6. **Gallery** - Photo showcase
7. **Packages** - Pricing options
8. **Contact** - Inquiry form with map

---

## 🌍 Language Toggle

Click the **globe icon** (🌐) in the top-right corner to switch between:
- **SL** - Slovenian
- **EN** - English

---

## 📝 Quick Customizations

### 1. Update Contact Information (5 min)

Edit: `lib/translations.ts`

Find and update:
```typescript
contact: {
  info: {
    address: 'Šmarje pri Podčetrtku, Slovenija',  // Your address
    email: 'info@heavenresort.com',                // Your email
    phone: '+386 XX XXX XXX',                      // Your phone
  },
}
```

### 2. Add Real Photos (10 min)

1. Copy your photos to: `public/images/gallery/`
2. Edit: `components/sections/Gallery.tsx`
3. Update image paths

### 3. Update Pricing (5 min)

Edit: `lib/translations.ts`

Find the `packages` section and update prices:
```typescript
wedding: {
  title: 'Poročni Paket',
  price: 'Od €3,500',  // Change this
  features: [...]
}
```

---

## 🗄️ Enable Booking System (15 min)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up (free)
3. Create new project

### Step 2: Set Up Database
1. In Supabase, go to SQL Editor
2. Copy contents of `supabase-setup.sql`
3. Paste and run

### Step 3: Get API Keys
1. Go to Settings > API
2. Copy `URL` and `anon public` key

### Step 4: Add to Environment
1. Create file: `.env.local`
2. Add:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```
3. Restart dev server: `npm run dev`

✅ **Done!** Forms now save to database.

---

## 🚀 Deploy to Internet (20 min)

### Easiest: Vercel (Free)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "HEAVEN Resort website"
   git remote add origin https://github.com/yourusername/heaven-resort.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Add environment variables
   - Click "Deploy"

3. **Your site is live!** 🎉
   - URL: `https://your-project.vercel.app`
   - Free SSL certificate
   - Automatic deployments on push

---

## 📱 Test on Mobile

1. Find your computer's IP address:
   ```bash
   ip addr show | grep inet
   ```

2. On your phone, visit:
   ```
   http://YOUR_IP:3000
   ```

---

## 🎯 Common Tasks

### Stop Development Server
```bash
# Press Ctrl+C in terminal
```

### Start Development Server
```bash
cd /home/jack/CascadeProjects/heaven-resort
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Check for Errors
```bash
npm run lint
```

---

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill existing process
killall node
# Or use different port
npm run dev -- -p 3001
```

### Changes Not Showing
1. Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Clear browser cache
3. Restart dev server

### Forms Not Working
1. Check `.env.local` exists
2. Verify Supabase keys are correct
3. Check browser console for errors

### Images Not Loading
1. Ensure images are in `public/images/`
2. Check file names match code
3. Restart dev server

---

## 📚 Full Documentation

For detailed information, see:

- **README.md** - Complete setup guide
- **DEPLOYMENT.md** - Deployment options
- **PROJECT-SUMMARY.md** - Project overview
- **supabase-setup.sql** - Database schema

---

## ✅ Pre-Launch Checklist

Before showing to clients:

- [ ] Update contact information
- [ ] Add real venue photos
- [ ] Test contact form
- [ ] Test on mobile device
- [ ] Check both languages (SL/EN)
- [ ] Verify all links work
- [ ] Update pricing if needed

---

## 🎨 Brand Assets Used

Your website uses the official HEAVEN Resort brand:

- **Logo**: Purple circular design with house icon
- **Color**: #7B4B8E (Purple)
- **Tagline**: "TRANSFORMATIVNA IDOŽIVETJA"
- **Location**: Šmarje pri Podčetrtku
- **Features**: Hilltop location, sunset views, 10+ guests

---

## 💡 Tips

### Make Small Changes
1. Edit a file
2. Save
3. Browser auto-refreshes
4. See changes instantly!

### Test Everything
- Click all navigation links
- Submit forms
- Toggle language
- Resize browser window
- Test on phone

### Keep Backups
```bash
# Create backup
cp -r /home/jack/CascadeProjects/heaven-resort /home/jack/heaven-resort-backup
```

---

## 🎉 You're Ready!

Your HEAVEN Resort website is:
- ✅ Running locally
- ✅ Fully functional
- ✅ Mobile responsive
- ✅ Production ready
- ✅ Easy to customize

**Next Step**: Add your real content and deploy! 🚀

---

## 📞 Need Help?

1. Check error messages in browser console (F12)
2. Review documentation files
3. Check terminal output for errors
4. Google specific error messages

---

**Happy Building! 🏔️**

*HEAVEN Resort - Transformativna Idoživetja*
