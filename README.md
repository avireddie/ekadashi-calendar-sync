# Ekadashi Calendar Sync 🌙

A beautiful web application to sync Ekadashi dates with your Google Calendar, helping devotees maintain their spiritual practices.

## Features

- 📅 Automatic sync of all Ekadashi dates to Google Calendar
- 🔔 Customizable reminders before each Ekadashi
- 🌍 Location-based date calculations
- ⚙️ Support for different traditions (Vaishnava/Smarta)
- 📱 Responsive design for all devices

## Live Demo

Visit: [Your GitHub Pages URL will be here]

## Setup Instructions

### 1. Clone or Download this Repository

```bash
git clone https://github.com/YOUR-USERNAME/ekadashi-calendar-sync.git
cd ekadashi-calendar-sync
```

### 2. Deploy to GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Under "Source", select "main" branch
4. Click "Save"
5. Your site will be live at: `https://YOUR-USERNAME.github.io/ekadashi-calendar-sync/`

### 3. (Optional) Set up Google Calendar API

To enable actual Google Calendar integration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins: `https://YOUR-USERNAME.github.io`
6. Copy your Client ID and API Key
7. Update `script.js` with your credentials:
   ```javascript
   const CLIENT_ID = 'your-client-id-here';
   const API_KEY = 'your-api-key-here';
   ```

## Technologies Used

- HTML5
- CSS3 (with responsive design)
- Vanilla JavaScript
- Google Calendar API (optional integration)

## File Structure

```
ekadashi-calendar-sync/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```

## Ekadashi Dates Included (2026)

- Jaya Ekadashi (Feb 13)
- Vijaya Ekadashi (Feb 27)
- Amalaki Ekadashi (Mar 15)
- Papmochani Ekadashi (Mar 29)
- And 18 more throughout the year...

## Customization Options

- **Timezone**: Select your location for accurate date calculations
- **Tradition**: Choose between Vaishnava (ISKCON) or Smarta
- **Reminders**: Set custom reminder times (1-168 hours before)
- **Additional Info**: Include Parana times and fasting guidelines

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

This project is open source and available under the MIT License.

## Support

If you find this helpful, please star ⭐ the repository!

---

🕉️ May your spiritual practice be blessed
