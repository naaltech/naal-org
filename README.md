[![Netlify Status](https://api.netlify.com/api/v1/badges/b2109aab-755a-4666-bec2-59ed81819d38/deploy-status)](https://app.netlify.com/projects/nevzatayaz-etkilesim-agi/deploys)
# 🏫 Nevzat Ayaz Anatolian High School Interaction Network  

**Nevzat Ayaz Anatolian High School** student interaction platform. A modern digital platform that connects students through activities, clubs, and shared interests.

## 🌟 Features

### 📱 **Main Platform**
- **Instagram Feed**: View school clubs' Instagram posts in a single platform
- **Club Pages**: Dedicated pages for each club with detailed information
- **Certificate Verification**: Certificate validation system
- **Student Email**: Google Workspace student email account requests

## 🚀 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Netlify
- **Icons**: Lucide React

## 🔗 Related Repositories

To understand the complete project, you can check out the following repositories:

🛠️ [Interaction Network Admin Interface](https://github.com/naaltech/naal-org-admin)
📱 [Instagram Post Fetch](https://github.com/naaltech/instagram-post-fetch)
📰 [News API](https://github.com/naaltech/news-api)


## 📦 Installation

### Requirements
- Node.js 18+ 
- pnpm (recommended)
- Supabase account

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── certificates/       # Certificate verification
│   ├── clubs/              # Club pages
│   ├── instagram/          # Instagram feed
│   └── student-email/      # Student email requests
├── components/             # React components
│   ├── ui/                 # Shadcn/ui components
│   └── ...                 # Custom components
├── lib/                    # Utility functions
├── public/                 # Static files
└── supabase/              # Database schemas
```

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set up environment variables
3. Automatic deployment will be active

### Manual Deployment
```bash
pnpm build
pnpm start
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

