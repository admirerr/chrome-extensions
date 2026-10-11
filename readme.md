# 🧩 Chrome Extensions Collection

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/admirerr/chrome-extensions)

Welcome to my repository of custom-built Google Chrome extensions! This repository serves as a centralized hub for various tools and productivity boosters I've developed. 

Since these extensions are currently not published on the official Chrome Web Store, they can be easily installed locally using Chrome's **Developer Mode**.

---

## 📦 Available Extensions

Here are the extensions currently available in this repository:

### 1. [TUF Copilot](./tuf-copilot)
**Folder:** `/tuf-copilot`  
A premium coding assistant for competitive programmers practicing on [takeUforward.org](https://takeuforward.org). It seamlessly extracts the problem statement and your code, generates a highly optimized prompt, and automatically opens and pastes it into ChatGPT for an instant, no-fluff code review.

*(More extensions will be added here in the future!)*

---

## 🛠️ How to Install (Developer Mode)

You can install any extension from this repository in just a few seconds.

### Step 1: Download the Repository
You can either clone the repository using Git or download it as a ZIP file.

**Option A: Clone via Git**
```bash
git clone [https://github.com/admirerr/chrome-extensions.git](https://github.com/admirerr/chrome-extensions.git)
```

**Option B: Download ZIP**
1. Click the green **Code** button at the top right of this repository.
2. Select **Download ZIP**.
3. Extract the downloaded ZIP file to an easily accessible location on your computer.

### Step 2: Load into Chrome
1. Open Google Chrome.
2. Type `chrome://extensions/` into the URL bar and press **Enter**.
3. In the top right corner of the Extensions page, turn on the **Developer mode** toggle switch.
4. Click the **Load unpacked** button that appears in the top left menu.
5. **Crucial Step:** A file browser will open. Do not select the entire `chrome-extensions` root folder. Instead, select the **specific subfolder** of the extension you want to install (e.g., select the `tuf-copilot` folder). Chrome needs to see the `manifest.json` file immediately inside the folder you choose.

🎉 **That's it! The extension is now installed and active.** 

*Note: You can pin the extension to your Chrome toolbar by clicking the "Puzzle" icon in the top right of your browser and clicking the "Pin" icon next to the extension's name.*

---

## 🔄 Updating an Extension

If you pull new changes from this repository or edit the code locally:
1. Go back to `chrome://extensions/`.
2. Find the extension card you want to update.
3. Click the circular **Reload icon ↻** on the card.
4. Refresh any active webpages where the extension operates to apply the latest changes.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE). Feel free to fork, modify, and use these extensions!