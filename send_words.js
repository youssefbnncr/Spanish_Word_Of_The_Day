import fetch from "node-fetch";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Get a random English word
async function getEnglishWord() {
  const res = await fetch("https://random-word-api.herokuapp.com/word");
  const data = await res.json();
  return data[0];
}

// Get a random Spanish word
async function getSpanishWord() {
  const res = await fetch("https://random-word-api.herokuapp.com/word?lang=es");
  const data = await res.json();
  return data[0];
}

// Send message to Discord
async function sendToDiscord(message) {
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  });
}

async function main() {
  const english = await getEnglishWord();
  const spanish = await getSpanishWord();

  const message =
    `📘 **Daily Random Words**\n\n` +
    `🇬🇧 **${english}**\n` +
    `🇪🇸 **${spanish}**`;

  await sendToDiscord(message);

  console.log("Sent:", message);
}

main().catch((err) => console.error(err));
