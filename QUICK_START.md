# 🚀 Quick Start Guide - Google Ads Manager

**Get your Google Ads Management Platform running in 5 minutes!**

## ⚡ **Instant Setup (If you have Google Ads API access)**

### 1. **Start the Application**
```bash
cd google-ads-manager
bun install          # Install dependencies
bun dev             # Start the server
```

### 2. **Open in Browser**
- **URL**: http://localhost:3000
- You should see the Google Ads Manager dashboard

### 3. **Connect Your Google Ads Account**
- Click **"API Setup"** in the navigation
- Enter your credentials:
  - **Customer ID** (without dashes)
  - **Developer Token**
  - **Client ID & Client Secret** (from Google Cloud)
  - **Refresh Token** (from OAuth flow)
- Click **"Test Connection"**

### 4. **Start Managing Campaigns!**
- **Dashboard**: View performance metrics
- **Campaigns**: Manage your campaigns with live data
- **Create**: Use the campaign creation wizard

---

## 🔑 **Need Google Ads API Access?**

If you don't have API credentials yet:

### **Quick Setup (15 minutes)**

1. **Google Cloud Console**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create project → Enable Google Ads API
   - Setup OAuth → Create desktop credentials

2. **Google Ads**
   - Go to [ads.google.com](https://ads.google.com)
   - Tools & Settings → API Center
   - Request developer token *(takes 1-2 days for approval)*

3. **OAuth Flow**
   - Generate OAuth URL in the app
   - Get authorization code
   - Exchange for refresh token using curl/Postman

**Detailed instructions in the main README.md**

---

## ✅ **What You Get**

✅ **Real Google Ads Integration** - Live campaign data
✅ **Multi-Account Support** - Manager account switching
✅ **Professional Dashboard** - Performance metrics & insights
✅ **Campaign Creation** - Step-by-step wizard with AI analysis
✅ **Secure Architecture** - Server-side API calls only
✅ **TypeScript Codebase** - Production-ready, maintainable code

---

## 🆘 **Quick Troubleshooting**

**Can't connect to localhost:3000?**
- Make sure `bun dev` is running
- Try http://127.0.0.1:3000
- Check if port 3000 is free

**Authentication failing?**
- Double-check all credentials
- Verify Google Ads API is enabled
- Make sure you're added as test user in OAuth consent

**Need help?**
- Check browser console for errors
- Review the full README.md
- Verify credentials in Google Cloud Console

---

**🎯 Ready to manage your Google Ads campaigns like a pro!**
