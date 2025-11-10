# 🔍 Dorkify - Google Dork Query Generator

Transform plain English into powerful Google Dork queries instantly. An advanced search query generator for security research, ethical hacking, and information gathering.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack & Requirements](#-tech-stack--requirements)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Google Dork Operators](#-google-dork-operators)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Functionality
- **Natural Language Converter**: Transform plain English into Google Dork syntax
- **40+ Operator Library**: Comprehensive reference with examples
- **Quick Templates**: Pre-built queries for common security research tasks
- **Instant Search**: Open generated queries directly in Google
- **One-Click Copy**: Copy operators, examples, and queries to clipboard

### 🔧 Enhanced Features
- **Smart Pattern Matching**: 30+ GHDB pattern recognitions
- **Category Filtering**: 10 color-coded operator categories
- **Real-time Search**: Filter operators by name/description
- **Editable Queries**: Manually customize generated queries
- **Keyboard Shortcuts**: Ctrl/Cmd+Enter to convert
- **Toast Notifications**: User feedback for all actions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Modern dark theme with gradient effects

---

## 🛠 Tech Stack & Requirements

### Core Technologies
```json
{
  "framework": "Next.js 15.0.3 (App Router)",
  "runtime": "React 19",
  "language": "TypeScript 5",
  "styling": "Tailwind CSS 4",
  "package-manager": "bun 1.0+"
}
```

### Dependencies
```json
{
  "dependencies": {
    "next": "^15.0.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0",
    "sonner": "^1.7.3",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^15.0.3"
  }
}
```

### System Requirements
- **Node.js**: 18.x or higher
- **Bun**: 1.0 or higher (recommended)
- **Browser**: Modern browser with ES6+ support

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd dorkify
```

### 2. Install Dependencies
Using **bun** (recommended):
```bash
bun install
```

Or using **npm**:
```bash
npm install
```

### 3. Run Development Server
```bash
bun run dev
# or
npm run dev
```

### 4. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🚀 Usage

### Natural Language Converter
1. Type your search query in plain English (e.g., "Find PDF resumes for senior developers in 2024")
2. Click **"Convert to Dork"** or press **Ctrl/Cmd+Enter**
3. View the generated Google Dork query
4. **Edit the query manually** if needed
5. Click **"Search on Google"** or **"Copy Query"**

### Quick Templates
1. Browse the 6 pre-built templates:
   - 🔒 Login Pages
   - 📄 PDF Documents
   - 📊 Excel Files
   - 🔐 Configuration Files
   - 📁 Directory Listings
   - 🗄️ Database Files
2. Click any template to load it
3. **Edit the query** as needed
4. Search or copy the query

### Operator Library
1. Browse 40+ Google Dork operators
2. Filter by category (Domain, File, Content, etc.)
3. Search by name or description
4. Click **"Copy"** to copy operator syntax
5. Click **"Try Example"** to test with Google

---

## 📁 Project Structure

```
dorkify/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage (Main UI)
│   │   ├── layout.tsx            # Root layout wrapper
│   │   ├── globals.css           # Global styles + Tailwind
│   │   └── favicon.ico           # App icon
│   │
│   ├── components/
│   │   ├── DorkConverter.tsx     # Natural language converter
│   │   ├── DorkLibrary.tsx       # Operator reference library
│   │   └── ui/
│   │       └── sonner.tsx        # Toast notifications
│   │
│   └── lib/
│       ├── dork-converter.ts     # Conversion logic (30+ patterns)
│       └── utils.ts              # Utility functions
│
├── public/                       # Static assets
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
└── README.md                     # This file
```

---

## 🔨 Development

### Build for Production
```bash
bun run build
# or
npm run build
```

### Start Production Server
```bash
bun start
# or
npm start
```

### Lint Code
```bash
bun run lint
# or
npm run lint
```

### File Overview

#### `src/app/page.tsx`
- Main homepage component
- Hero header with branding
- Integration of DorkConverter and DorkLibrary
- Feature cards and information sections

#### `src/components/DorkConverter.tsx`
- Natural language input field
- **Editable** Google Dork output
- Quick template buttons
- Copy and Search functionality

#### `src/components/DorkLibrary.tsx`
- 40+ operator reference
- Category filtering
- Search functionality
- Copy and example testing

#### `src/lib/dork-converter.ts`
- 30+ pattern matching rules
- Natural language processing
- GHDB query generation logic

#### `src/app/globals.css`
- Tailwind CSS configuration
- Custom dark theme colors
- Gradient effects and animations
- Responsive design utilities

---

## 🔍 Google Dork Operators

### Categories (40+ Operators)
1. **Domain** (5): site:, inurl:, intitle:, link:, related:
2. **File** (3): filetype:, ext:, cache:
3. **Content** (4): intext:, allintext:, inanchor:, allinanchor:
4. **Security** (8): Login pages, admin panels, configs, logs, etc.
5. **Advanced** (5): AROUND(), wildcards, ranges, define:
6. **Logic** (4): OR, AND, -, ""
7. **Metadata** (3): author:, location:, daterange:
8. **Media** (2): imagesize:, movie:
9. **Social** (3): @, #, source:
10. **Misc** (3): weather:, stocks:, map:

### Pattern Recognition Examples
```javascript
"find login pages on example.com"
→ site:example.com inurl:login OR inurl:admin OR inurl:signin

"PDF files about cybersecurity"
→ filetype:pdf cybersecurity

"Excel spreadsheets with passwords from 2023"
→ filetype:xls OR filetype:xlsx password 2023

"exposed database backups"
→ filetype:sql OR filetype:db OR filetype:mdb "database backup"
```

---

## ⚠️ Ethical Use & Disclaimer

**USE RESPONSIBLY AND ETHICALLY**

- ✅ Security research with proper authorization
- ✅ Educational purposes and learning
- ✅ Information gathering for legitimate purposes
- ✅ Penetration testing with client consent

- ❌ Unauthorized access to systems
- ❌ Data theft or privacy violations
- ❌ Illegal activities or malicious intent
- ❌ Hacking without permission

**Dorkify is an educational tool designed for legitimate security research and advanced search techniques. Always respect privacy, follow legal guidelines, and obtain proper authorization before security testing.**

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🌟 Features Roadmap

- [ ] Save favorite dorks
- [ ] Export query history
- [ ] Advanced regex patterns
- [ ] Multi-language support
- [ ] API endpoint for conversions
- [ ] Browser extension

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [yuvarajkk76@gmail.com]

---

**Made with 💜 by [YUVARAJ & TEAM]**

*Empowering ethical security research through advanced search capabilities*
