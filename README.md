# 🌴 BigOasis – Time & Space Complexity Analyzer

> *Your AI-powered oasis in the desert of algorithm complexity!* 🏜️✨

<div align="center">

![BigOasis Logo](https://img.shields.io/badge/BigOasis-🌴_TC_&_SC-brightgreen?style=for-the-badge)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue?style=for-the-badge&logo=google-chrome)](#-installation)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Made with Love](https://img.shields.io/badge/Made%20with-💙-red?style=for-the-badge)](https://github.com/narendraxgupta/bigoasis)

*Transform your LeetCode experience with instant AI-powered complexity analysis!*

</div>

## 🚀 What is BigOasis?

BigOasis is a **Chrome extension** that brings the power of **Google Gemini AI** directly to your LeetCode coding sessions! No more manual Big-O calculations or complexity guesswork – get instant, accurate analysis of your algorithms with beautiful visual feedback.

### ✨ Key Features

🤖 **AI-Powered Analysis**
- Powered by Google Gemini 2.5 Flash for lightning-fast results
- 100% accurate time & space complexity calculations
- Smart optimization suggestions for poor complexity

🎨 **Beautiful Interface**
- Draggable & resizable floating panel
- Transparency mode for distraction-free coding
- Confetti animations for optimal solutions! 🎉
- Dark theme that matches LeetCode

⚡ **Smart Features**
- **Keyboard shortcuts**: `Ctrl+Shift+A` to analyze, `Ctrl+Shift+H` to hide
- **Rate limiting** with user-friendly countdown
- **Copy results** with one click
- **Multiple AI models** to choose from

🛡️ **Privacy First**
- Your API key stays local in your browser
- No data sent to external servers (except Google Gemini)
- Open source and transparent

## 📸 Screenshots

```
┌─────────────────────────────────────┐
│ 🌴 BigOasis TC & SC    [Analyze] 📋 │
├─────────────────────────────────────┤
│ ⏱ Time: 🟢 O(log n)                │
│ 💾 Space: 🟢 O(1)                  │
│ 💡 Why: Binary search reduces...    │
│ ⚡ Analysis took 1.2s               │
└─────────────────────────────────────┘
```

## 🎯 Installation

### Manual Installation (Developer Mode)
1. **Download** or clone this repository:
   ```bash
   git clone https://github.com/narendraxgupta/bigoasis.git
   ```
   *Or download as ZIP and extract*

2. **Open Chrome** and navigate to `chrome://extensions/`

3. **Enable Developer Mode** by toggling the switch in the top-right corner

4. **Click "Load unpacked"** and select the BigOasis folder

5. **Pin the extension** by clicking the puzzle piece icon and pinning BigOasis

6. **You're ready!** The extension will now work on LeetCode pages 🎉

### 🏪 Chrome Web Store
*Coming soon! We're working on getting BigOasis published to the Chrome Web Store for easier installation.*

## 🔧 Setup

### Get Your Free API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a free account (if needed)
3. Generate your API key
4. Copy the key

### Configure BigOasis
1. Click the BigOasis extension icon
2. Select **"Options"** or click the ⚙️ settings button
3. Paste your API key
4. Choose your preferred AI model:
   - **Gemini 2.5 Flash** ⚡ *(Recommended - best balance)*
   - **Gemini 2.5 Pro** 🧠 *(Highest quality)*
   - **Gemini 2.0 Flash** 🚀 *(Fastest)*

## 🎮 How to Use

### Quick Start
1. Open any LeetCode problem
2. Write your solution
3. Press `Ctrl+Shift+A` or click **"Analyze"**
4. Get instant complexity analysis! ✨

### Pro Tips
- 🎯 **Drag the panel** anywhere on screen
- 🔄 **Resize** by dragging the bottom-right corner
- 👁️ **Toggle transparency** for see-through mode
- 📋 **Copy results** to share with friends
- ➖ **Minimize** when not needed
- ⌨️ **Hide quickly** with `Ctrl+Shift+H`

## 🎨 Customization

### Visual Modes
- **Normal Mode**: Solid dark panel
- **Transparent Mode**: Glassmorphism effect with blur
- **Minimized Mode**: Compact header-only view

### AI Models
Choose based on your needs:
- **Speed** → Gemini 2.0 Flash
- **Balance** → Gemini 2.5 Flash ⭐
- **Accuracy** → Gemini 2.5 Pro

## 🛠️ Development

### Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), CSS3
- **AI**: Google Gemini API
- **Platform**: Chrome Extension (Manifest V3)
- **Storage**: Chrome Storage API

### Project Structure
```
BigOasis/
├── 📄 manifest.json      # Extension configuration
├── 🎨 content.css        # Beautiful styling
├── ⚡ content.js         # Main functionality
├── 🔗 pageBridge.js      # Code extraction
├── ⚙️ options.html       # Settings page
├── 🔧 options.js         # Settings logic
└── 📁 icons/             # Extension icons
    ├── 16.png
    ├── 48.png
    └── 128.png
```

### Contributing
We love contributions! 💙

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

## 🐛 Troubleshooting

### Common Issues

**❌ "API Key Required"**
- Make sure you've added your Gemini API key in settings
- Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey)

**❌ "Could not read code"**
- Refresh the LeetCode page
- Make sure you're on a LeetCode problem page
- Try writing some code first

**❌ Rate limit errors**
- Wait a few seconds between analyses (5-second cooldown)
- The extension shows a countdown timer

**❌ Extension not working**
- Check if you're on a supported domain (leetcode.com, leetcode.cn, leetcode.org)
- Make sure Developer Mode is enabled in Chrome extensions
- Try reloading the page after installation
- Verify the extension is enabled and pinned
- Disable other conflicting extensions

## 💖 Support the Project

If BigOasis is helping you ace those coding interviews, consider supporting the development:

[![Buy Me a Coffee](https://img.shields.io/badge/☕-Buy%20me%20a%20coffee-orange?style=for-the-badge)](https://www.buymeacoffee.com/narendraxgupta)

Every coffee helps keep BigOasis free and improving! ☕✨

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 🤖 **Google Gemini** for powering our AI analysis
- 💻 **LeetCode** for the amazing platform
- 🌟 **Open Source Community** for inspiration
- ☕ **Coffee** for fueling late-night coding sessions

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/narendraxgupta/bigoasis?style=social)
![GitHub forks](https://img.shields.io/github/forks/narendraxgupta/bigoasis?style=social)
![GitHub issues](https://img.shields.io/github/issues/narendraxgupta/bigoasis)
![GitHub last commit](https://img.shields.io/github/last-commit/narendraxgupta/bigoasis)

---

<div align="center">

**Made with 💙 by developers, for developers**

*Happy coding! May your algorithms be optimal and your complexities be O(1)!* 🚀

[⭐ Star this repo](https://github.com/narendraxgupta/bigoasis) • [🐛 Report Bug](https://github.com/narendraxgupta/bigoasis/issues) • [💡 Request Feature](https://github.com/narendraxgupta/bigoasis/issues)

</div>