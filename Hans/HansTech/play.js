import config from '../../config.cjs';
import fetch from 'node-fetch';

async function fetchJson(url, options = {}) {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
}

const play = async (m, sock) => {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === "play") {
        if (!text) {
            return m.reply("Please provide a song name to play.");
        }

        try {
            await m.React('🎶'); // Indicate we're processing the request

            let kyuu = await fetchJson(`https://api.agatz.xyz/api/ytsearch?message=${encodeURIComponent(text)}`);
            let songData = kyuu.data[0];

            if (!songData) {
                return m.reply("Song not found. Please try another search.");
            }

            // Send initial "Playing" message with context info and large thumbnail
            await sock.sendMessage(m.from, {
                text: `🎵 *Playing:* ${songData.title}`,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "HansTz", // Replace with your bot's name
                        newsletterJid: "120363352087070233@newsletter", // Replace with your newsletter JID if you have one
                    },
                    externalAdReply: {
                        title: "Music Player",
                        body: `Searching for: ${songData.title}`,
                        thumbnailUrl: songData.thumbnail || 'https://files.catbox.moe/fhox3r.jpg',
                        sourceUrl: global.link || 'https://example.com', // Replace with your link or remove
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailHeight: 500,
                        thumbnailWidth: 500,
                    },
                },
            }, { quoted: m });

            // Fetch audio URL
            let tylor = await fetchJson(`https://api.nexoracle.com/downloader/yt-audio2?apikey=free_key@maher_apis&url=${songData.url}`);
            let audioUrl = tylor.result.audio;

            if (!audioUrl) {
                return m.reply("Unable to fetch audio. Please try again.");
            }

            // Send the audio file with context info and large thumbnail
            await sock.sendMessage(m.from, {
                audio: { url: audioUrl },
                fileName: `${songData.title}.mp3`,
                mimetype: "audio/mpeg",
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "Hans-Xmd", // Replace with your bot's name
                        newsletterJid: "120363352087070233@newsletter", // Replace with your newsletter JID if you have one
                    },
                    externalAdReply: {
                        title: songData.title,
                        body: `.mp3 audio`,
                        thumbnailUrl: songData.thumbnail || 'https://files.catbox.moe/fhox3r.jpg',
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailHeight: 500,
                        thumbnailWidth: 500,
                    },
                },
            }, { quoted: m });

        } catch (error) {
            console.error("Error in play command:", error);
            m.reply("An error occurred while processing your request. Please try again later.");
        }
    }
}

export default play;