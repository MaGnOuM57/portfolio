import React from 'react';
import { Rocket, Briefcase, Cpu, Code, Activity, FileText, Search, Sparkles, ShieldCheck } from 'lucide-react';

export const projects = [
  {
    id: 'elliev',
    category: "web_data",
    status: "production",
    tech: ["React", "Node.js", "NLP (Sentiment Analysis)", "Twitter API", "Google News", "Reddit API", "TikTok API", "Proxies"],
    icon: <Search size={24} />,
    theme: "blue",
    featured: true
  },
  {
    id: 'tokenization-platform',
    category: "finance_blockchain",
    status: "prototype",
    tech: ["Node.js", "Express", "Socket.io", "TailwindCSS", "Chart.js", "Blockchain", "Smart Contracts", "Innovation"],
    icon: <ShieldCheck size={24} />,
    theme: "emerald",
    featured: true,
    demoLink: '/tokenization'
  },
  {
    id: 'job-monitor',
    category: "ai_automation",
    status: "production",
    tech: ["Node.js", "Discord.js", "Puppeteer", "Lingva API", "JSON DB", "Automatisation"],
    icon: <Briefcase size={24} />,
    theme: "blue",
    featured: true,
    demoLink: '/jobs'
  },
  {
    id: 'algo-trading',
    category: "finance_blockchain",
    status: "production",
    tech: ["Python", "Alpaca API", "Pandas", "Yahoo Finance", "Discord API", "Automatisation", "Business Intelligence", "Power BI", "Tableau", "ETL"],
    icon: <Cpu size={24} />,
    theme: "emerald",
    featured: true,
    demoLink: '/trading'
  },
  {
    id: 'tiktok-automation',
    category: "ai_automation",
    status: "production",
    tech: ["Python", "OpenAI API", "MoviePy", "Edge-TTS", "TikTok API", "Automatisation"],
    icon: <Rocket size={24} />,
    theme: "pink",
    featured: true,
    demoLink: 'https://www.tiktok.com/@minitech13'
  },
  {
    id: 'auto-stream',
    category: "ai_automation",
    status: "prototype",
    tech: ["Python", "OpenCV", "Librosa", "Streamlink", "FFmpeg", "Tkinter", "Automatisation"],
    icon: <Code size={24} />,
    theme: "purple",
    featured: false
  },
  {
    id: 'sports-arbitrage',
    category: "finance_blockchain",
    status: "development",
    tech: ["Python", "Reverse Engineering", "Fuzzy Logic", "Redis", "Telegram API", "Automatisation"],
    icon: <Activity size={24} />,
    theme: "orange",
    featured: false
  },
  {
    id: 'smart-cv',
    category: "ai_automation",
    status: "prototype",
    tech: ["Javascript", "Chrome API (V3)", "OpenAI API (GPT-4o/o1)", "Webpack", "HTML2PDF", "Innovation"],
    icon: <FileText size={24} />,
    theme: "pink",
    featured: false
  },
  {
    id: 'ezlod',
    category: "ai_automation",
    status: "production",
    tech: ["Python", "Selenium", "Requests", "Pillow", "SQLite", "GraphQL", "Automatisation", "SQL", "ETL"],
    icon: <Rocket size={24} />,
    theme: "cyan",
    featured: false
  },
  {
    id: 'seo-audit',
    category: "web_data",
    status: "production",
    tech: ["Python", "BeautifulSoup", "Scrapy", "React", "Tailwind", "SEO", "Google Analytics"],
    icon: <Search size={24} />,
    theme: "cyan",
    featured: false
  },
  {
    id: 'tcg-collector',
    category: "ai_automation",
    status: "production",
    tech: ["Next.js 14", "TypeScript", "Azure AI", "Supabase", "Puppeteer", "Automatisation"],
    icon: <Sparkles size={24} />,
    theme: "purple",
    featured: false
  }
];
