# HEAVEN Resort - Deployment Guide

This guide will help you deploy the HEAVEN Resort website to production.

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   cd /home/jack/CascadeProjects/heaven-resort
   git init
   git add .
   git commit -m "Initial commit: HEAVEN Resort website"
   ```

2. **Push to GitHub**:
   ```bash
   # Create a new repository on GitHub first, then:
   git remote add origin https://github.com/yourusername/heaven-resort.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New Project"**

3. **Import your GitHub repository**

4. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

6. **Click "Deploy"**

7. **Your site will be live** at `https://your-project.vercel.app`

### Step 3: Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `heavenresort.com`)
4. Follow DNS configuration instructions
5. SSL certificate is automatically provisioned

---

## 🐳 Alternative: Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build the Docker image
docker build -t heaven-resort .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  heaven-resort
```

---

## 🌐 Alternative: Traditional VPS Deployment

### Prerequisites
- Ubuntu 22.04 LTS server
- Node.js 18+
- Nginx
- PM2 process manager

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Step 2: Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/heaven-resort.git
cd heaven-resort

# Install dependencies
sudo npm install

# Create .env.local
sudo nano .env.local
# Add your environment variables

# Build application
sudo npm run build

# Start with PM2
sudo pm2 start npm --name "heaven-resort" -- start
sudo pm2 save
sudo pm2 startup
```

### Step 3: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/heaven-resort
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name heavenresort.com www.heavenresort.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/heaven-resort /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d heavenresort.com -d www.heavenresort.com
```

---

## 📊 Post-Deployment Checklist

### Essential Checks

- [ ] Website loads correctly at production URL
- [ ] All images display properly
- [ ] Language toggle works (SL/EN)
- [ ] Contact form submits successfully
- [ ] Booking form works and saves to Supabase
- [ ] Mobile responsive design works
- [ ] All navigation links work
- [ ] SSL certificate is active (HTTPS)
- [ ] Custom domain configured (if applicable)

### Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure CDN for images
- [ ] Enable caching headers
- [ ] Optimize images (WebP format)
- [ ] Test page load speed (Google PageSpeed Insights)

### SEO Setup

- [ ] Submit sitemap to Google Search Console
- [ ] Add Google Analytics
- [ ] Verify Open Graph tags
- [ ] Test meta descriptions
- [ ] Add structured data (Schema.org)

### Security

- [ ] Environment variables are secure
- [ ] Supabase RLS policies are configured
- [ ] Rate limiting on forms (prevent spam)
- [ ] CORS configured properly
- [ ] Security headers configured

---

## 🔄 Continuous Deployment

### Automatic Deployments with Vercel

Vercel automatically deploys when you push to GitHub:

1. **Production**: Push to `main` branch
2. **Preview**: Create a pull request
3. **Rollback**: Revert to previous deployment in Vercel dashboard

### Manual Deployment Updates

```bash
# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild
npm run build

# Restart PM2 (if using VPS)
pm2 restart heaven-resort
```

---

## 📧 Email Notifications Setup

To receive email notifications for new bookings:

### Option 1: Supabase Database Webhooks

1. Go to Supabase Dashboard > Database > Webhooks
2. Create webhook for `bookings` table INSERT events
3. Point to your email service API endpoint

### Option 2: Supabase Edge Functions

Create an Edge Function to send emails:

```typescript
// supabase/functions/send-booking-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { record } = await req.json()
  
  // Send email using your preferred service
  // (SendGrid, Mailgun, AWS SES, etc.)
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart dev server after changing .env.local
- In Vercel, redeploy after adding environment variables

### Images Not Loading

- Check images are in `public/` directory
- Verify image paths don't have leading slash
- Configure Next.js image domains in `next.config.js`

### Supabase Connection Issues

- Verify URL and anon key are correct
- Check Supabase project is not paused
- Ensure RLS policies allow public insert

---

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Next.js build output
3. Check browser console for errors
4. Verify environment variables are set

---

## 🎉 Success!

Your HEAVEN Resort website should now be live and accessible to the world!

**Next Steps:**
1. Share the URL with stakeholders
2. Set up analytics and monitoring
3. Create content management workflow
4. Plan for regular updates and maintenance

---

*Built with ❤️ for HEAVEN Resort*
