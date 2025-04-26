import axios from "axios";
import config from "../../config.cjs";

const img = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : "";
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const reply = (msg) =>
    sock.sendMessage(m.from, { text: msg }, { quoted: m });

  if (cmd === "img") {
    if (!text) {
      return reply(
        `*Example:*\n${prefix + cmd} <number> <query>\nExample: ${prefix + cmd} 2 ferrari`
      );
    }

    const [num, ...queryParts] = text.split(" ");
    const query = queryParts.join(" ");
    const numImages = parseInt(num);

    if (isNaN(numImages) || numImages < 1 || numImages > 10) {
      return reply(
        `Please choose a number between 1 and 10.\nExample: ${prefix + cmd} 2 ferrari`
      );
    }

    try {
      await sock.sendMessage(m.from, { react: { text: "🔎", key: m.key } });

      const apiResponse = await axios.get(
        `https://apis.davidcyriltech.my.id/googleimage`,
        {
          params: { query },
        }
      );

      const { success, results } = apiResponse.data;

      if (!success || !results || results.length === 0) {
        return reply(`❌ No images found for "${query}". Try another search.`);
      }

      const maxImages = Math.min(results.length, numImages);
      for (let i = 0; i < maxImages; i++) {
        await sock.sendMessage(
          m.from,
          {
            image: { url: results[i] },
            caption: `📷 *Image Search*\n🔎 *Query:* "${query}"\n📄 *Result:* ${
              i + 1
            }/${maxImages}`,
            contextInfo: {
              forwardingScore: 5,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterName: "HANSTZ TECH",
                newsletterJid: "120363352087070233@newsletter",
              },
            },
          },
          { quoted: m }
        );
      }

      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
    } catch (err) {
      console.error("Error in img command:", err);
      reply("❌ *Error fetching images. Try again later.*");
    }
  }
};

export default img;
