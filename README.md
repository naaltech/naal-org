[![Netlify Status](https://api.netlify.com/api/v1/badges/b2109aab-755a-4666-bec2-59ed81819d38/deploy-status)](https://app.netlify.com/projects/nevzatayaz-etkilesim-agi/deploys)
# 🏫 Nevzat Ayaz Anatolian High School Interaction Network  

**Nevzat Ayaz Anatolian High School** student interaction platform. A modern digital platform that connects students through activities, clubs, and shared interests.

<img width="1280" height="640" alt="Untitled design" src="https://github.com/user-attachments/assets/a9c8386e-21ee-479a-85c1-a0ebcb48a3fa" />

## 🌟 Features

### 📱 **Main Platform**
- **Instagram Feed**: View school clubs' Instagram posts in a single platform
- **Club Pages**: Dedicated pages for each club with detailed information
- **Certificate Verification**: Certificate validation system

## 🚀 Technology Stack

- **Frontend**: Astro, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Netlify (server islands, CDN cache)
- **Icons**: Heroicons

## 🔗 Related Repositories

To understand the complete project, you can check out the following repositories:

🛠️ [Club Admin Interface](https://github.com/naaltech/naal-org-admin)
📱 [Instagram Post Fetch](https://github.com/naaltech/instagram-post-fetch)
📰 [News API](https://github.com/naaltech/news-api)


## 📦 Installation

### Requirements
- Node.js 22.23+
- pnpm (recommended)
- Supabase account

## 📁 Project Structure

```
├── src/
│   ├── pages/              # Astro routes
│   ├── layouts/            # Page layouts
│   ├── components/         # Astro components
│   │   └── ui/             # UI primitives
│   ├── scripts/            # Client-side TypeScript
│   ├── lib/                # Utility functions
│   └── middleware.ts       # Subdomain redirects
└── public/                 # Static files
```

The database schema lives in the [admin repository](https://github.com/naaltech/naal-org-admin).

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set up environment variables
3. Automatic deployment will be active

### Manual Deployment
```bash
pnpm build
pnpm preview
```

## 📄 License

This project is licensed under the GPLv3 License. See the [LICENSE](LICENSE) file for details.

