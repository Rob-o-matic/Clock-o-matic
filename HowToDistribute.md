# How to Publish Clock-o-matic on the Chrome Web Store

This guide walks you through publishing Clock-o-matic as a free extension on the Google Chrome Web Store, with donation support via Buy Me a Coffee.

---

## Prerequisites

Before you start, you'll need:

1. **A Google Account** (if you don't have one, create it at https://accounts.google.com)
2. **A Chrome Web Store Developer Account** ($5 one-time registration fee)
3. **The extension files** (you have them ready in this repo)
4. **Marketing assets**:
   - Extension icon (multiple sizes)
   - 2–4 screenshots of the extension in action
   - A short description and detailed product description
   - Privacy policy (we'll create a simple one)

---

## Step 1: Register as a Chrome Web Store Developer

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **Register** (if you haven't already registered)
3. Review and accept the Chrome Web Store Developer Agreement
4. Pay the **$5 registration fee** (one-time)
5. Complete your developer profile with:
   - Your name or organization name
   - Contact email
   - Website (optional, but recommended)

---

## Step 2: Prepare Your Extension Assets

### Icons

Create icon files at these sizes (PNG format, RGB, no transparency needed):
- **16px** – Small icon for Chrome's extension menu
- **32px** – Small icon (high-DPI)
- **48px** – Medium icon
- **128px** – Large icon (for Web Store listing)

**Pro tip**: Use a simple, recognizable design. The clock face with a label works well.

**Tools to create icons**:
- Figma (free tier) – https://www.figma.com
- Canva – https://www.canva.com
- Online icon editors (e.g., Pixlr, Photopea)

Update your `manifest.json` with all icon sizes:
```json
"icons": {
  "16": "icons/icon16.png",
  "32": "icons/icon32.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```

### Screenshots

Capture 2–4 screenshots showing Clock-o-matic in use:

1. **Clock on a slide** – Show the clock overlay on a Google Slides deck
2. **Schedule setup** – Show the controls with time blocks configured
3. **In action** – Show the clock during a presentation with segments highlighted
4. **Minimal/fullscreen mode** – Optional: show different display modes

**Requirements**:
- Minimum size: **1280 × 800 pixels**
- PNG or JPG format
- Show real, professional-looking use cases

**Tip**: Take screenshots at 1920×1080 and crop to 1280×800 for best quality.

### Privacy Policy

Create a simple `PRIVACY.md` file in your repo. Here's a template:

```markdown
# Privacy Policy for Clock-o-matic

## Data We Collect

Clock-o-matic stores the following data **locally on your device only**:

- Your clock position, size, and display mode
- Time block configurations (minutes, labels, colors)
- Alarm queue and sound preferences
- Label positions and custom offsets

**All data is stored in Chrome's local storage and is NOT transmitted to external servers.**

## Data We Do NOT Collect

- Personal information (name, email, location, etc.)
- Usage analytics or telemetry
- Information about your presentations or content
- Browser history or browsing behavior

## Changes to This Policy

We may update this policy from time to time. Changes will be noted in the extension's release notes.

## Contact

If you have questions about this privacy policy, please open an issue on our GitHub repository.
```

---

## Step 3: Prepare Your Chrome Web Store Listing

### Short Description (Max 132 characters)

Example:
```
Visual timer for Google Slides with customizable time blocks, alarms, and persistent state tracking.
```

### Detailed Description

Here's a template you can adapt:

```
Clock-o-matic is a beautiful, interactive visual timer for Google Slides. Perfect for:
• Presentations and live demos
• Training sessions and workshops
• Classroom lessons and lectures
• Standup meetings and time-boxed discussions
• Webinars and online events

✨ Features:
• Colorful time blocks with visual progress tracking
• Real-time clock with hour, minute, and second hands
• Smart alarms at the end of each time block
• Persistent state per presentation (auto-saves!)
• Minimal and fullscreen display modes
• Draggable and resizable UI
• Full accessibility support

🎯 How It Works:
1. Add your time blocks (e.g., "Intro: 5 min" in green)
2. Click "Set Visual Schedule" to start
3. Watch the segments rotate and change color as time elapses
4. Hear a gentle chime when each block finishes

💾 Your data stays private—everything is stored locally on your device.

☕ If you love Clock-o-matic, consider supporting development with a small donation!

Free, forever. Enjoy!
```

### Categories

Select:
- **Productivity** (primary)
- **Time Management** (optional)

### Language

Set to **English (en)**

---

## Step 4: Upload Your Extension to the Web Store

1. Log in to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

2. Click **Create new item** (or **New item** if it's your first)

3. Select your extension ZIP file:
   - Go to your project folder (`/Users/graeme/Clock-o-matic`)
   - Create a ZIP containing all files:
     ```bash
     cd /Users/graeme
     zip -r Clock-o-matic.zip Clock-o-matic/ -x "*.git*" "node_modules/*"
     ```
   - Upload the ZIP file

4. Chrome will analyze your manifest and extract basic info

5. Fill in the store listing fields:

   **Title**: `Clock-o-matic`
   
   **Short description**: [Use your 132-character tagline]
   
   **Detailed description**: [Paste the full description from Step 3]
   
   **Category**: Productivity
   
   **Language**: English
   
   **Developer contact email**: [Your email]
   
   **Homepage URL**: [Your GitHub repo URL]
     ```
     https://github.com/Rob-o-matic/Clock-o-matic
     ```

6. Upload your assets:

   **Icon**: 
   - Upload the 128px icon (required)
   - Also recommended: 48px and 32px variants

   **Screenshots**:
   - Upload 2–4 screenshots (1280×800 minimum, but 1920×1080 recommended)
   - Add captions to explain each screenshot

   **Privacy policy URL**:
   - Either host it on your GitHub (add `PRIVACY.md` to your repo)
     ```
     https://raw.githubusercontent.com/Rob-o-matic/Clock-o-matic/main/PRIVACY.md
     ```
     OR
   - Use a privacy policy generator (e.g., TermsFeed.com)

7. Review your listing in the preview panel

---

## Step 5: Add Donation Links

Your extension already includes a "Buy me a coffee" link in the code:

```javascript
const DONATION_URL = "https://www.buymeacoffee.com/Robomatic";
```

To get paid donations:

1. Create or log in to your [Buy Me a Coffee](https://www.buymeacoffee.com) account
2. Set up your payment method and profile
3. Get your personalized URL (e.g., `https://www.buymeacoffee.com/Robomatic`)
4. Update `content.js` with your actual URL:
   ```javascript
   const DONATION_URL = "https://www.buymeacoffee.com/YOUR_USERNAME";
   ```
5. Commit and push the change to GitHub

**Note**: The extension prompts users to donate only if they explicitly click the coffee icon. It's completely optional and non-intrusive.

---

## Step 6: Submit for Review

1. In the Developer Dashboard, scroll to **Submit for review**
2. Check the following before submission:
   - [ ] Manifest version is valid (start at 1.0.0)
   - [ ] All icons and screenshots are uploaded
   - [ ] Privacy policy URL is correct
   - [ ] Extension description is clear and professional
   - [ ] Donation link is in place (optional)

3. Read and confirm compliance with [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program_policies/)
   - Your extension is free and open-source ✅
   - No deceptive behavior ✅
   - Uses only required permissions ✅

4. Click **Submit for review**

Google typically reviews extensions within **1-3 days**. You'll receive an email confirming approval or listing any issues to fix.

---

## Step 7: After Approval 🎉

Once approved, your extension will:
- Appear on the [Chrome Web Store](https://chrome.google.com/webstore)
- Be installable with a single click by any Chrome user
- Show your profile and donation link

**Spread the word!**
- Share the Chrome Web Store link on social media, Reddit, and developer communities
- Add it to your GitHub README
- Consider posting to:
  - ProductHunt.com
  - Chrome Extensions subreddits (r/Chrome, r/productivity)
  - Designer/educator Discord servers
  - Tech newsletters

---

## Step 8: Maintenance & Updates

### Updating Your Extension

When you make improvements or fix bugs:

1. Update the version number in `manifest.json`:
   ```json
   "version": "1.0.1"
   ```

2. Commit and push to GitHub:
   ```bash
   git add -A
   git commit -m "v1.0.1: [feature description]"
   git push
   ```

3. Create a new ZIP file:
   ```bash
   zip -r Clock-o-matic-1.0.1.zip Clock-o-matic/ -x "*.git*"
   ```

4. Upload the ZIP in the Developer Dashboard
5. Update the store listing description if needed
6. Submit for review

Google typically reviews updates faster than initial submissions (24-48 hours).

### Monitoring Performance

In the Developer Dashboard, you can see:
- Number of active installations
- Crash reports
- User reviews and ratings
- Daily active users

Use this data to guide future improvements!

---

## Checklist Before Publishing

- [ ] Manifest version is set to 1.0.0
- [ ] All icon sizes are created and added to manifest
- [ ] 2+ high-quality screenshots taken
- [ ] Short description (132 chars) written
- [ ] Detailed description is polished and professional
- [ ] Privacy policy is created and hosted (GitHub URL)
- [ ] Buy Me a Coffee link is updated with your username
- [ ] Tested the extension thoroughly in Chrome
- [ ] All permissions in manifest are justified
- [ ] No console errors or warnings
- [ ] GitHub repo is public and well-documented

---

## Troubleshooting

**Q: My submission was rejected. What now?**
A: Google will email you with specific reasons. Common issues:
- Misleading description → Rewrite to match actual functionality
- Icon/screenshot quality → Use higher resolution images
- Privacy policy missing → Add and resubmit

**Q: How long until approval?**
A: Usually 1-3 days for initial submissions, 24-48 hours for updates.

**Q: Can I charge for it?**
A: Not recommended for your first extension, but yes—you can set a price in the Developer Dashboard. Keeping it free with donations is a great approach for getting early users!

**Q: What if I find a bug after publishing?**
A: Fix it, bump the version, and resubmit. Users with the old version will auto-update within 24 hours.

---

## Resources

- [Chrome Web Store Developer Program](https://developer.chrome.com/docs/webstore/)
- [Chrome Extension Manifest V3 Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program_policies/)
- [Buy Me a Coffee Platform](https://www.buymeacoffee.com)

---

## Next Steps

1. Create your icon and screenshots
2. Write your privacy policy
3. Update your donation link
4. Register as a Chrome Web Store developer ($5)
5. Follow this guide to upload and submit
6. **Celebrate your launch!** 🎉

Good luck, and thanks for building Clock-o-matic! 🚀
