# 🚀 Google Ads Management Platform

A comprehensive, professional-grade Google Ads management platform built with Next.js, TypeScript, and real Google Ads API integration.

![Platform Dashboard](/.same/screenshots/dashboard.png)

## ✨ Features

### 🎯 **Core Functionality**
- **Real Google Ads API Integration** - Connect to your actual Google Ads accounts
- **Multi-Account Management** - Switch between multiple client accounts (Google Ads managers)
- **Live Campaign Data** - Real-time metrics, impressions, clicks, conversions, ROAS
- **Campaign Creation Wizard** - Step-by-step campaign setup with landing page analysis
- **Professional Dashboard** - Comprehensive performance overview and quick actions

### 🔒 **Security & Architecture**
- **Server-Side API Calls** - Secure Google Ads API integration through Next.js API routes
- **OAuth 2.0 Authentication** - Proper Google Ads authentication flow
- **Credential Encryption** - Secure local storage of API credentials
- **TypeScript Strict Mode** - Production-ready, type-safe codebase

### 📊 **Pages & Features**
- **Dashboard** (`/`) - Performance metrics, connection status, recent campaigns
- **Campaign Management** (`/campaigns`) - View, filter, and manage campaigns
- **API Setup** (`/api-setup`) - Connect Google Ads account with step-by-step guide
- **Campaign Creation** (`/campaigns/create`) - Multi-step campaign creation wizard
- **Analytics** (`/analytics`) - Performance analysis and reporting
- **Asset Management** (`/assets`) - Creative asset organization

## 🛠️ **Desktop Setup Instructions**

### **Prerequisites**

1. **Node.js & Bun**
   ```bash
   # Install Node.js 18+ from https://nodejs.org
   # Install Bun (faster package manager)
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Google Ads API Access**
   - Google Ads account with API access
   - Google Cloud Project with Google Ads API enabled
   - Developer token (applies within 1-2 business days)
   - OAuth 2.0 credentials (Client ID & Secret)

### **Installation**

1. **Download/Clone the Project**
   ```bash
   # If you have the project files:
   cd google-ads-manager

   # Or clone from a repository:
   # git clone <your-repo-url>
   # cd google-ads-manager
   ```

2. **Install Dependencies**
   ```bash
   bun install
   # This installs all required packages including Google Ads API
   ```

3. **Start the Development Server**
   ```bash
   bun dev
   ```

4. **Open the Application**
   - Open your browser to: **http://localhost:3000**
   - You should see the Google Ads Manager dashboard

## 🔑 **Google Ads API Setup**

### **Step 1: Google Cloud Console Setup**

1. **Create/Select Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Ads API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Ads API" and enable it

3. **Setup OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in app information:
     - App name: "Google Ads Manager"
     - User support email: Your email
     - Developer contact: Your email
   - Add scope: `https://www.googleapis.com/auth/adwords`
   - Add yourself as a test user

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Desktop application"
   - Save the **Client ID** and **Client Secret**

### **Step 2: Google Ads Developer Token**

1. **Request Developer Token**
   - Go to [Google Ads](https://ads.google.com/)
   - Navigate to Tools & Settings → API Center
   - Apply for developer token
   - **Note**: Approval takes 1-2 business days

2. **Get Your Customer ID**
   - In Google Ads, find your Customer ID (format: 123-456-7890)
   - You'll enter this **without dashes** (1234567890)

### **Step 3: Connect in the Application**

1. **Open API Setup Page**
   - In the running application, click "API Setup" or "Connect Account"
   - Or go directly to: http://localhost:3000/api-setup

2. **Enter Credentials**
   - **Customer ID**: Your Google Ads account ID (without dashes)
   - **Developer Token**: From Google Ads API Center
   - **Client ID**: From Google Cloud OAuth credentials
   - **Client Secret**: From Google Cloud OAuth credentials

3. **Generate OAuth URL**
   - Click "Generate OAuth URL"
   - Open the generated URL in a new tab
   - Sign in with your Google account
   - Authorize the application
   - Copy the authorization code

4. **Get Refresh Token**
   - Use a tool like curl or Postman to exchange the authorization code for a refresh token:
   ```bash
   curl -X POST https://oauth2.googleapis.com/token \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "code=YOUR_AUTHORIZATION_CODE" \
     -d "grant_type=authorization_code" \
     -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob"
   ```
   - Copy the `refresh_token` from the response

5. **Test Connection**
   - Enter the refresh token in the application
   - Click "Test Connection"
   - You should see your Google Ads account information

## 🎯 **Using the Platform**

### **Dashboard Overview**
- **Connection Status** - Shows if your Google Ads account is connected
- **Performance Metrics** - Total spend, active campaigns, conversions, ROAS
- **Recent Campaigns** - Your latest campaign performance
- **Quick Actions** - Access to main features

### **Campaign Management**
- **View All Campaigns** - Live data from your Google Ads account
- **Account Switching** - If you have a manager account, switch between clients
- **Performance Metrics** - Real impressions, clicks, CTR, conversions, CPA
- **Filtering & Search** - Find campaigns by name, status, or type

### **Campaign Creation**
- **Landing Page Analysis** - Analyze your landing page for optimization
- **Business Type Detection** - Automatic campaign setup based on your business
- **Keyword Research** - AI-powered keyword suggestions
- **Ad Copy Generation** - Create compelling ad headlines and descriptions
- **Budget & Targeting** - Set budgets, locations, and audience targeting

## 🔧 **Technical Details**

### **Project Structure**
```
google-ads-manager/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/google-ads/     # API routes for Google Ads integration
│   │   ├── campaigns/          # Campaign management pages
│   │   └── api-setup/          # API setup and connection page
│   ├── components/             # Reusable React components
│   ├── contexts/               # React Context for global state
│   └── lib/                    # Utility functions and services
├── public/                     # Static assets
└── .same/                      # Project documentation and todos
```

### **Key Technologies**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Google Ads API** - Real Google Ads integration
- **Bun** - Fast package manager and runtime

### **API Endpoints**
- `POST /api/google-ads/validate` - Validate credentials and get account info
- `POST /api/google-ads/campaigns` - Fetch campaign data
- `POST /api/google-ads/oauth` - Generate OAuth authorization URLs

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"localhost refused to connect"**
   - Make sure you ran `bun dev` and the server is running
   - Check that port 3000 isn't being used by another application
   - Try http://127.0.0.1:3000 instead

2. **"Authentication failed"**
   - Verify your OAuth credentials are correct
   - Make sure you've added yourself as a test user in Google Cloud Console
   - Check that the Google Ads API is enabled in your Google Cloud project

3. **"Developer token not approved"**
   - Developer tokens require approval from Google (1-2 business days)
   - You can use test accounts during development

4. **"Customer not found"**
   - Make sure your Customer ID is entered without dashes
   - Verify you have access to the Google Ads account

### **Getting Help**
- Check the browser console for error messages
- Review the API Setup page for detailed instructions
- Verify all credentials are entered correctly

## 📈 **Development & Customization**

### **Adding Features**
The platform is built with modularity in mind. You can easily extend it:

- **Add new pages** in `src/app/`
- **Create new API endpoints** in `src/app/api/`
- **Add new components** in `src/components/`
- **Extend the Google Ads service** in `src/lib/google-ads-api.ts`

### **Deployment Options**
- **Local Development**: `bun dev` (recommended for testing)
- **Production Build**: `bun run build` then `bun start`
- **Docker**: Can be containerized for deployment
- **Cloud Platforms**: Supports Vercel, Netlify, AWS, etc.

## ✅ **System Requirements**
- **Node.js**: 18.0 or higher
- **Bun**: Latest version (recommended)
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)
- **RAM**: 4GB+ recommended
- **Storage**: 1GB for dependencies and data

## 🎉 **Ready to Use!**

Your Google Ads Management Platform is now ready for professional use with your actual Google Ads accounts. The platform provides a secure, efficient way to manage campaigns, analyze performance, and create new advertising campaigns with real-time data integration.

**Happy advertising!** 🚀
