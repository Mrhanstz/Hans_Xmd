import config from '../../config.cjs';
import fetch from 'node-fetch';

const playvideo = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "video") {
    try {
      const searchResult = await fetch(`https://api.agatz.xyz/api/ytsearch?message=${encodeURIComponent(text)}`);
      const resultData = await searchResult.json();
      const videoData = resultData.data[0];

      if (!videoData) {
        return sock.sendMessage(m.from, { text: "❌ Video not found. Try another keyword." }, { quoted: m });
      }

      const caption = `📽 *Now Playing:* ${videoData.title}`;

      // Step 1: Send message with image preview
      await sock.sendMessage(m.from, {
        image: { url: videoData.thumbnail || 'https://files.catbox.moe/fhox3r.jpg' },
        caption: caption,
        contextInfo: {
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: "HANS-TECH",
            newsletterJid: "120363352087070233@newsletter"
          },
          externalAdReply: {
            title: "ʜᴀɴs-xᴍᴅ_ᴠ2",
            body: "HANSTZ",
            mediaType: 1,
            thumbnailUrl: videoData.thumbnail || 'https://files.catbox.moe/fhox3r.jpg',
            sourceUrl: global.link || videoData.url,
            renderLargerThumbnail: true,
            thumbnailHeight: 500,
            thumbnailWidth: 500
          }
        }
      }, { quoted: m });

      // Step 2: Fetch actual video download URL
      const fetchVideo = await fetch(`https://api.nexoracle.com/downloader/yt-video2?apikey=free_key@maher_apis&url=${videoData.url}`);
      const video = await fetchVideo.json();

      if (!video.result || !video.result.video) {
        return sock.sendMessage(m.from, { text: "❌ Failed to fetch video. Try again later." }, { quoted: m });
      }

      // Step 3: Send the video
      await sock.sendMessage(m.from, {
        video: { url: video.result.video },
        fileName: `${videoData.title}.mp4`,
        mimetype: "video/mp4"
      }, { quoted: m });

    } catch (error) {
      console.error("PlayVideo Error:", error);
      await sock.sendMessage(m.from, {
        text: "❌ An error occurred. Please try again later."
      }, { quoted: m });
    }
  }
};

export default playvideo;
