import config from '../../config.cjs';
import fetch from 'node-fetch';

const repo = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "repo") {
    try {
      const repoUrl = "https://api.github.com/repos/mrhanstz/HANS-XMD_V2";
      const response = await fetch(repoUrl);
      const repoData = await response.json();

      const styles = [
        `
╭━〔 *HANS-XMD_V2 REPO* 〕━⬣
┃🔧 *Repo:* ${repoData.html_url}
┃⭐ *Stars:* ${repoData.stargazers_count}
┃🍴 *Forks:* ${repoData.forks_count}
┃👁 *Watchers:* ${repoData.watchers_count}
┃🧑‍💻 *Owner:* ${repoData.owner.login}
┃⚙️ *Status:* ${repoData.archived ? "Archived" : "Active"}
╰───────────────⬣`,

        `
╔══❖•ೋ❥ *HANS-XMD_V2*
║★ GitHub Repo Info
║★ Stars: ${repoData.stargazers_count}
║★ Forks: ${repoData.forks_count}
║★ Watchers: ${repoData.watchers_count}
║★ Owner: ${repoData.owner.login}
║★ Status: ${repoData.archived ? "Archived" : "Active"}
║★ URL: ${repoData.html_url}
╚═════════════❥`,

        `
╭───────────────◆
│ *HANS-XMD_V2 GITHUB*
│
│ 🔗 ${repoData.html_url}
│ ⭐ Stars: ${repoData.stargazers_count}
│ 🍴 Forks: ${repoData.forks_count}
│ 👁 Watchers: ${repoData.watchers_count}
│ 🛠 Status: ${repoData.archived ? "Archived" : "Active"}
╰────────────────◆`
      ];

      const caption = styles[Math.floor(Math.random() * styles.length)];

      // 1. Send image with repo info
      await sock.sendMessage(m.from, {
        image: { url: "https://files.catbox.moe/fhox3r.jpg" },
        caption: caption,
        contextInfo: {
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: "HANS-TECH",
            newsletterJid: "120363352087070233@newsletter"
          }
        }
      }, { quoted: m });

      // 2. Send audio separately
      await sock.sendMessage(m.from, {
        audio: { url: "https://github.com/Mrhanstz/HANS-XMD_V3/raw/refs/heads/main/Hans-Tz/HansTz.mp3" },
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: m });

    } catch (e) {
      await sock.sendMessage(m.from, { text: `❌ Error fetching repo info:\n${e.message}` }, { quoted: m });
      console.log("Repo Error:", e);
    }
  }
};

export default repo;
