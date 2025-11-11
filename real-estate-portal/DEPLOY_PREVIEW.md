# 🌐 Direct Preview from Git

This guide shows you how to preview and run the Real Estate Portal directly from Git without local setup.

---

## ✨ Option 1: Gitpod (Recommended - One-Click Setup)

**Instant cloud development environment with automatic setup**

### Quick Start:

1. **Open in Gitpod:**

   Click this button or visit the URL:

   [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Rameshvr1234/sathish/tree/claude/analysis-work-011CV1ME7QanoCY78PJ3ne5e)

   Or manually visit:
   ```
   https://gitpod.io/#https://github.com/Rameshvr1234/sathish/tree/claude/analysis-work-011CV1ME7QanoCY78PJ3ne5e
   ```

2. **Wait for automatic setup:**
   - PostgreSQL installs automatically
   - Backend dependencies install
   - Frontend dependencies install
   - Both servers start automatically

3. **Access the application:**
   - Frontend will open automatically in a preview
   - Backend API available on port 5000

**Free Tier:** 50 hours/month

---

## 🖥️ Option 2: GitHub Codespaces

**Official GitHub cloud environment**

### Steps:

1. Go to: https://github.com/Rameshvr1234/sathish
2. Click the green **"Code"** button
3. Select **"Codespaces"** tab
4. Click **"Create codespace on branch"**
5. Once loaded, run in terminal:

```bash
# Install PostgreSQL
sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib
sudo service postgresql start
sudo -u postgres createdb real_estate_portal

# Start Backend (Terminal 1)
cd real-estate-portal/backend
npm install
cp .env.example .env
npm run dev

# Start Frontend (Terminal 2)
cd real-estate-portal/frontend
npm install
cp .env.example .env
npm start
```

6. Access via forwarded ports (Codespaces will notify you)

**Free Tier:** 60 hours/month for personal accounts

---

## 🚀 Option 3: StackBlitz (Frontend Only)

**For quick frontend preview without backend**

### Limitations:
- Frontend only (no backend/database)
- API calls won't work
- Good for UI/UX preview only

### Steps:

1. Visit: https://stackblitz.com/github/Rameshvr1234/sathish/tree/claude/analysis-work-011CV1ME7QanoCY78PJ3ne5e?file=real-estate-portal/frontend/src/App.jsx

2. Wait for dependencies to install

3. Frontend will preview automatically

---

## 🐳 Option 4: Docker (If Repository Has Docker Support)

**Run with Docker - Coming Soon**

Docker configuration is planned for future releases.

---

## 📊 Comparison Table

| Feature | Gitpod | GitHub Codespaces | StackBlitz |
|---------|--------|-------------------|------------|
| Full Stack Support | ✅ Yes | ✅ Yes | ❌ No |
| Database Support | ✅ Yes | ✅ Yes | ❌ No |
| Auto Setup | ✅ Yes | ⚠️ Manual | ✅ Yes |
| Free Tier | 50 hrs/mo | 60 hrs/mo | Unlimited |
| Setup Time | 2-3 min | 3-4 min | 30 sec |
| Best For | Full development | GitHub users | Quick preview |

---

## 🔗 Direct Access Links

### Gitpod (One-Click):
```
https://gitpod.io/#https://github.com/Rameshvr1234/sathish/tree/claude/analysis-work-011CV1ME7QanoCY78PJ3ne5e
```

### GitHub (Manual Setup):
```
https://github.com/Rameshvr1234/sathish/tree/claude/analysis-work-011CV1ME7QanoCY78PJ3ne5e
```

### StackBlitz (Frontend Only):
```
https://stackblitz.com/github/Rameshvr1234/sathish/tree/claude/analysis-work-011CV1ME7QanoCY78PJ3ne5e?file=real-estate-portal/frontend/src/App.jsx
```

---

## ⚡ Quick Recommendation

**For Full Application Preview:**
→ Use **Gitpod** (fastest, automatic setup)

**For GitHub Users:**
→ Use **GitHub Codespaces** (integrated with GitHub)

**For UI/Design Preview Only:**
→ Use **StackBlitz** (instant, no setup)

---

## 🆘 Troubleshooting

### Gitpod Issues:
- If PostgreSQL fails: Run `sudo service postgresql start`
- If ports not forwarding: Check Ports panel (bottom right)

### Codespaces Issues:
- Ports not accessible: Make port visibility "Public" in Ports panel
- PostgreSQL not starting: Run `sudo service postgresql restart`

---

## 📝 Notes

- All cloud environments provide temporary instances
- Changes are saved for 30 days of inactivity
- For persistent development, clone locally
- Free tiers have usage limits

---

**Need Help?** Check the main [README.md](./README.md) or [SETUP_GUIDE.md](./SETUP_GUIDE.md)
