# openFrameworks Forum RSS generator

Use the https://alptugan.github.io/openframeworks-forum-rss-generator/feed.xml link to receive latest posts in your RSS reader.

A web scraper and static site viewer for the [openFrameworks community forum](https://forum.openframeworks.cc). Scrapes latest posts and generates both an RSS feed and a beautiful static website viewable on GitHub Pages.

## 🚀 Features

- 📡 **RSS Feed Generator** - Creates RSS 2.0 compatible feed
- 🎨 **Modern Static Website** - Beautiful, responsive UI to browse posts
- 🔍 **Real-time Search** - Filter posts by title or author
- 📊 **Statistics Dashboard** - View post and author counts
- 🌙 **Dark Theme** - Eye-friendly design
- 📱 **Mobile Responsive** - Works on all devices
- 🚀 **GitHub Pages Ready** - Deploy instantly to GitHub Pages

## 📁 Project Structure

```
openframeworks-forum-rss-generator/
├── backend/
│   └── scraper.js          # Node.js scraper script
├── docs/                   # GitHub Pages static site
│   ├── index.html         # Main page
│   ├── css/
│   │   └── style.css      # Styles
│   ├── js/
│   │   └── app.js         # Frontend logic
│   ├── posts.json         # Generated posts data
│   └── feed.xml           # Generated RSS feed
├── package.json
└── README.md
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/alptugan/openframeworks-forum-rss-generator.git
cd openframeworks-forum-rss-generator
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

## 📖 Usage

### Run the Scraper

Scrape latest posts and generate RSS feed + JSON data:

```bash
pnpm scrape
# or
npm run scrape
```

This will:
- Fetch latest posts from openFrameworks forum
- Generate `docs/feed.xml` (RSS feed)
- Generate `docs/posts.json` (JSON data)

### Preview the Website Locally

```bash
pnpm preview
# or
npm run preview
```

Visit `http://localhost:3000` to view the site.

### Development Mode

Run scraper and preview in one command:

```bash
pnpm dev
# or
npm run dev
```

## 🚀 Deploy to GitHub Pages

1. Push your repository to GitHub

2. Go to repository **Settings** → **Pages**

3. Under **Source**, select:
   - Branch: `main` (or your default branch)
   - Folder: `/docs`

4. Click **Save**

5. Your site will be available at:
   ```
   https://<username>.github.io/<repository-name>/
   ```

6. **Set up automated scraping** (optional):
   - Create a GitHub Action to run the scraper daily
   - See `.github/workflows/scrape.yml` example below

## 🤖 Automated Scraping (GitHub Actions)

Create `.github/workflows/scrape.yml`:

```yaml
name: openframeworks Forum RSS generator

on:
  schedule:
    - cron: '0 */6 * * *'  # Run every 6 hours
  workflow_dispatch:  # Allow manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Run scraper
        run: npm run scrape
        
      - name: Commit and push if changed
        run: |
          git config --global user.name 'GitHub Action'
          git config --global user.email 'action@github.com'
          git add docs/
          git diff --quiet && git diff --staged --quiet || (git commit -m "Update scraped data" && git push)
```

## 📡 RSS Feed

Subscribe to the RSS feed:
```
https://<username>.github.io/<repository-name>/feed.xml
```

Compatible with all RSS readers (Feedly, NewsBlur, etc.)


## 📝 API

The scraper uses the Discourse JSON API:
```
https://forum.openframeworks.cc/latest.json
```

## 🔧 Technologies

**Backend:**
- Node.js
- Axios (HTTP requests)
- Cheerio (HTML parsing)

**Frontend:**
- Vanilla JavaScript
- Modern CSS (Grid, Flexbox)
- No framework dependencies

