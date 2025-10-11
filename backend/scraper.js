const axios = require("axios");

function escapeXml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function generateRSS(posts) {
    const now = new Date().toUTCString();

    let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>openFrameworks Forum - Latest Posts</title>
    <link>https://forum.openframeworks.cc/latest</link>
    <description>Latest posts from the openFrameworks community forum</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="https://forum.openframeworks.cc/latest.rss" rel="self" type="application/rss+xml" />
`;

    posts.forEach((post) => {
        const pubDate = new Date(post.created_at).toUTCString();

        rss += `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.url)}</link>
      <guid isPermaLink="true">${escapeXml(post.url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.author)}</author>
      <description>${escapeXml(post.excerpt || post.title)}</description>
      <comments>${escapeXml(post.url)}</comments>
    </item>`;
    });

    rss += `
  </channel>
</rss>`;

    return rss;
}

async function scrapeWithAPI() {
    try {
        // Discourse forums provide a JSON API by adding .json to URLs
        const response = await axios.get("https://forum.openframeworks.cc/latest.json", {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                Accept: "application/json",
            },
            timeout: 10000,
        });

        const data = response.data;
        const posts = [];

        console.log("Fetched data successfully");

        // Extract topics from the JSON response
        if (data.topic_list && data.topic_list.topics) {
            const topics = data.topic_list.topics;

            topics.forEach((topic, index) => {
                // Find user details from the users array
                const user = data.users?.find((u) => u.id === topic.posters?.[0]?.user_id);

                posts.push({
                    id: topic.id,
                    title: topic.title,
                    url: `https://forum.openframeworks.cc/t/${topic.slug}/${topic.id}`,
                    author: user ? user.username : "Unknown",
                    category: topic.category_id,
                    replies: topic.posts_count - 1, // Subtract 1 for the original post
                    views: topic.views,
                    created_at: topic.created_at,
                    last_posted_at: topic.last_posted_at,
                    pinned: topic.pinned || false,
                    excerpt: topic.excerpt || "",
                });
            });
        }

        console.log(`Found ${posts.length} posts`);
        return posts;
    } catch (error) {
        console.error("Error scraping:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        return [];
    }
}

// Run the scraper
scrapeWithAPI()
    .then((posts) => {
        const fs = require("fs");
        const path = require("path");

        // Output to docs directory for GitHub Pages
        const docsDir = path.join(__dirname, "..", "docs");

        // Generate and save RSS feed
        const rssContent = generateRSS(posts);
        fs.writeFileSync(path.join(docsDir, "feed.xml"), rssContent);
        console.log("\n=== RSS FEED GENERATED ===");
        console.log(`✓ Saved RSS feed with ${posts.length} posts to docs/feed.xml`);

        // Also save JSON for reference
        fs.writeFileSync(path.join(docsDir, "posts.json"), JSON.stringify(posts, null, 2));
        console.log("✓ Saved JSON data to docs/posts.json");

        // Show preview of first item
        console.log("\n=== PREVIEW (First Post) ===");
        if (posts.length > 0) {
            console.log(`Title: ${posts[0].title}`);
            console.log(`Author: ${posts[0].author}`);
            console.log(`URL: ${posts[0].url}`);
            console.log(`Published: ${new Date(posts[0].created_at).toUTCString()}`);
        }
    })
    .catch((error) => {
        console.error("Script error:", error);
    });
