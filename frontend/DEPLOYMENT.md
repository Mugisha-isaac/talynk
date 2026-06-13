# Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors in production build
- [ ] Environment variables documented
- [ ] Database migrations created
- [ ] Security review completed
- [ ] Performance optimized
- [ ] Error handling implemented
- [ ] Logging configured

## Vercel Deployment (Recommended)

### 1. Connect GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/Talynk.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Choose "Next.js" framework
5. Configure environment variables
6. Click "Deploy"

### 3. Environment Variables

Set these in Vercel project settings:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
HUGGINGFACE_API_KEY=...
```

### 4. Run Migrations

After deployment, run:

```bash
vercel env pull .env.local
npm run prisma:migrate
npm run prisma:seed
```

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set environment
ENV NODE_ENV=production
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

### 2. Create Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: Talynk
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/Talynk
      NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### 3. Build and Run

```bash
docker-compose up -d
```

## AWS Deployment

### Option A: EC2 + RDS

1. **Launch EC2 Instance**
   - Image: Ubuntu 22.04 LTS
   - Instance: t3.medium or larger
   - Security group: Allow 80, 443, 3000

2. **Setup Instance**
   ```bash
   # SSH into instance
   ssh -i key.pem ec2-user@your-instance-ip

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   sudo npm install -g pm2

   # Clone repository
   git clone https://github.com/yourusername/Talynk.git
   cd Talynk

   # Install dependencies
   npm install

   # Setup environment
   nano .env.local
   # Add your environment variables

   # Build and start
   npm run build
   pm2 start "npm start" --name "Talynk"
   pm2 startup
   pm2 save
   ```

3. **Setup RDS Database**
   - Create PostgreSQL instance
   - Configure security group
   - Update DATABASE_URL

4. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Option B: Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB App**
   ```bash
   eb init -p "Node.js 18" Talynk
   eb create Talynk-env
   ```

3. **Deploy**
   ```bash
   eb deploy
   ```

## Railway Deployment

1. Connect GitHub repository at [railway.app](https://railway.app)
2. Select Next.js template
3. Configure environment variables
4. Click "Deploy"

## Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create Talynk

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set NEXT_PUBLIC_SUPABASE_URL=...
heroku config:set DATABASE_URL=$(heroku config:get DATABASE_URL)

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate
heroku run npm run prisma:seed
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check health
curl https://yourdomain.com/api/health

# Check database connection
npm run prisma:studio
```

### 2. Configure Monitoring

```bash
# Install PM2 Plus for monitoring
pm2 install pm2-auto-pull
pm2 link <secret_key> <public_key>
```

### 3. Setup Backups

**Supabase:**
- Go to Backups section
- Enable automatic backups
- Test restore procedure

### 4. Enable HTTPS

- Get SSL certificate
- Configure redirect from HTTP to HTTPS
- Set security headers

### 5. Configure CDN

For static assets:
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.yourdomain.com'],
  },
};
```

## Performance Optimization

### 1. Enable Compression

```bash
# Vercel: Automatic
# Other platforms: Nginx compression
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_media_talent_id ON media(talent_id);
CREATE INDEX idx_media_sector_id ON media(sector_id);
CREATE INDEX idx_recommendations_sponsor ON recommendations(sponsor_id);
CREATE INDEX idx_recommendations_status ON recommendations(status);
```

### 3. Image Optimization

- Use Next.js Image component
- Implement lazy loading
- Generate WebP versions

### 4. Caching

```typescript
// next.config.js
module.exports = {
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};
```

## Monitoring & Logging

### Application Monitoring
- **Datadog**: Real User Monitoring
- **New Relic**: APM and Infrastructure
- **Sentry**: Error tracking

### Log Aggregation
- **Datadog Logs**
- **Logz.io**
- **PaperTrail**

### Uptime Monitoring
- **Ping**: Simple uptime checks
- **UptimeRobot**: Free monitoring
- **Pingdom**: Advanced monitoring

## Disaster Recovery

### Backup Strategy
1. Database: Daily automated backups
2. Code: Stored in Git repository
3. Media: Versioned in Supabase Storage

### Restore Procedure
1. Restore database from backup
2. Redeploy application
3. Verify media files
4. Test critical flows

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection headers
- [ ] CSRF tokens implemented
- [ ] Sensitive data not in logs
- [ ] API keys rotated
- [ ] Database credentials secure
- [ ] Environment variables not committed

## Cost Optimization

**Vercel:**
- Free tier: 100 GB bandwidth/month
- Pro: $20/month + usage

**Supabase:**
- Free tier: 500 MB database
- Pro: $25/month

**Hugging Face API:**
- Serverless Inference: $0.06/1000 calls
- Dedicated endpoint: $10/month

## Troubleshooting

### 502 Bad Gateway
- Check application logs
- Verify database connection
- Check memory usage

### Slow Performance
- Review database queries
- Check image sizes
- Enable caching

### Cannot Connect to Database
- Verify DATABASE_URL
- Check network security groups
- Test connection locally

### File Upload Issues
- Verify Supabase bucket exists
- Check bucket permissions
- Verify file size limits

---

For questions, check the [README.md](./README.md) and [DEVELOPMENT.md](./DEVELOPMENT.md)
