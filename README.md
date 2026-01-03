# CKCC Portfolio 2026

## Christian Kurt Cambonga - Dimensional Portfolio

A modern, interactive portfolio website featuring a **Dimensional Theme System** with 4 unique animated 3D backgrounds, auto-changing themes, and immersive visual effects.

## 🌟 Live Demo

[View Portfolio](https://ruueeee.github.io/CKCC_Portfolio_2026/)

## ✨ Features

### Theme System
- **4 Unique Themes** - AI Solutions, Multimedia Design, Automation, Web Development
- **Auto-Changing** - Themes rotate every 20 seconds with dimensional slash transitions
- **Logo Click** - Click logo to manually switch themes

### 3D Backgrounds (Three.js)
- **AI Theme** - Rotating Möbius strip with particle system
- **Multimedia Theme** - Floating geometric shapes with spreading movement
- **Automation Theme** - Circuit board with moving nodes and data packets
- **WebDev Theme** - Matrix rain with Japanese/English characters

### Interactive Effects
- **Mouse Reactive** - 3D objects respond to cursor hover
- **Glassmorphism UI** - Modern frosted glass design
- **Smooth Animations** - Scroll-triggered effects and transitions
- **Horror Mode** - Secret Easter egg (triple-tap logo)

### Contact Form
- **Telegram Integration** - Messages sent directly to Telegram
- **Real-time Feedback** - Success/error notifications

## 🛠️ Tech Stack

- HTML5, CSS3, JavaScript (ES6+)
- Three.js r128 for 3D graphics
- Telegram Bot API
- CSS Custom Properties for theming

## 📁 Project Structure

```
portfolio/
├── index.html      # Main HTML structure
├── style.css       # Styling & animations
├── script.js       # JavaScript & Three.js (1900+ lines)
├── config.js       # API credentials (gitignored)
├── img/            # Project images
├── .gitignore      # Git ignore rules
└── README.md       # Documentation
```

## 🚀 Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ruueeee/CKCC_Portfolio_2026.git
   cd CKCC_Portfolio_2026
   ```

2. **Create config.js** (for contact form)
   ```javascript
   const CONFIG = {
       TELEGRAM_BOT_TOKEN: 'your-bot-token',
       TELEGRAM_CHAT_ID: 'your-chat-id'
   };
   ```

3. **Serve locally**
   ```bash
   python -m http.server 8000
   # or use Live Server in VS Code
   ```

## 🎨 Customization

| Element | File | Location |
|---------|------|----------|
| Theme Colors | `script.js` | `THEMES` object at top |
| Content | `index.html` | Section elements |
| Styling | `style.css` | CSS variables in `:root` |
| 3D Effects | `script.js` | `create*` functions |

## 🎮 Easter Eggs

- **Triple-tap the logo** to activate Horror Mode
- **Click the logo** to manually switch themes
- **Hover over 3D objects** to see them react

## 📱 Responsive Design

Fully responsive across all devices with mobile-first approach.

## 📄 License

© 2026 Christian Kurt Cambonga. All rights reserved.