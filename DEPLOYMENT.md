# Deployment Guide

## Prerequisites for Production

- Node.js v14+ on production server
- npm or yarn
- Reverse proxy (Nginx/Apache)
- SSL certificates
- Database backup strategy

## Backend Deployment

### 1. Prepare for Production

Update `backend/.env`:

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_very_secure_secret_key_min_32_chars
H2_URL=your_h2_server_url
H2_DB_PATH=/var/lib/petcare/data
```

### 2. Install Dependencies

```bash
cd backend
npm install --production
```

### 3. Using PM2 for Process Management

```bash
npm install -g pm2

# Start the app
pm2 start src/server.js --name "pet-care-backend"

# Auto-restart on system reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

### 4. Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.petcare.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Frontend Deployment

### 1. Build for Production

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized files.

### 2. Deploy Static Files

Option A: Upload to Static Hosting (Vercel, Netlify)
```bash
# Using Vercel
npm i -g vercel
vercel
```

Option B: Serve with Nginx

```nginx
server {
    listen 80;
    server_name petcare.com;

    root /var/www/petcare/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://api.petcare.com;
    }
}
```

### 3. Enable HTTPS (Let's Encrypt)

```bash
# Using Certbot
sudo certbot --nginx -d petcare.com
```

## Database Migration to H2

For production H2 database setup:

### 1. Install H2 Server

```bash
# Download H2 from https://www.h2database.com
unzip h2-latest.zip
cd h2
./bin/h2.sh
```

### 2. Configure Backend for H2

Update `backend/src/config/database.js`:

```javascript
const sequelize = new Sequelize({
  dialect: 'h2',
  host: process.env.H2_URL,
  user: process.env.H2_USER,
  password: process.env.H2_PASSWORD,
  database: 'petcare',
});
```

### 3. Update Environment Variables

```env
H2_URL=your.h2.server.com
H2_USER=admin
H2_PASSWORD=secure_password
H2_DB_PATH=/data/petcare
```

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS for all communications
- [ ] Set strong database passwords
- [ ] Configure firewall rules
- [ ] Enable CORS only for your domain
- [ ] Use rate limiting on API
- [ ] Set up monitoring and logging
- [ ] Regular database backups
- [ ] Keep dependencies updated

## Environment Variables for Production

Backend `.env`:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=random_string_at_least_32_chars
H2_URL=production_h2_server
H2_USER=db_user
H2_PASSWORD=strong_db_password
```

Frontend configuration in `src/services/api.js`:
```javascript
const API_BASE_URL = 'https://api.petcare.com';
```

## Monitoring & Logging

### Backend Logs with PM2

```bash
pm2 logs pet-care-backend
pm2 logs pet-care-backend --lines 1000
```

### Database Backups

```bash
# Daily backup
0 2 * * * /backup/backup_db.sh
```

## Performance Optimization

### Frontend
- Enable gzip compression in Nginx
- Cache static assets (CSS, JS, images)
- Use CDN for images

### Backend
- Enable query logging
- Use database indexing
- Implement caching (Redis)
- Rate limiting

## Rollback Plan

Keep previous versions:
```bash
pm2 restart pet-care-backend
pm2 revert
```

A full backup before each deployment.
