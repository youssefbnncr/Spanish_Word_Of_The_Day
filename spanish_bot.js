import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// This is the single webhook URL retrieved from the GitHub Actions environment
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// --- Load Word Data ---
const wordsFilePath = path.join(process.cwd(), "spanish_words.json");
let wordData = [];

try {
  const data = fs.readFileSync(wordsFilePath, "utf8");
  wordData = JSON.parse(data);
  console.log(`Loaded ${wordData.length} total words from spanish_words.json.`);
} catch (error) {
  console.error("ERROR: Could not load or parse spanish_words.json file.");
  process.exit(1);
}

// ---------------------
//   HELPER FUNCTION TO GET RANDOM SPANISH WORD
// ---------------------
async function getRandomWord() {
  const wordsForLang = wordData;

  if (wordsForLang.length === 0) {
    console.error("No words found in the JSON file.");
    return {
      word: "Error",
      definition: "No words available in the list.",
      example: "N/A",
      synonym: "N/A",
      link: "#", // Add default link
    };
  }

  // Select a random word
  const randomIndex = Math.floor(Math.random() * wordsForLang.length);
  const wordObject = wordsForLang[randomIndex];

  return {
    word: wordObject.word,
    definition: wordObject.definition,
    example: wordObject.example,
    synonym: wordObject.synonym,
    // *** NEW: Include the link property ***
    link: wordObject.link,
  };
}

// ---------------------
//   SEND TO DISCORD
// ---------------------
async function sendToDiscord(message) {
  if (!WEBHOOK_URL) {
    console.error("WEBHOOK_URL is not set. Cannot send to Discord.");
    return;
  }
  // Send the POST request to the Discord Webhook
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  });
}

// ---------------------
//   MAIN MESSAGE BUILDER AND SENDER
// ---------------------
async function main() {
  const spanish = await getRandomWord();

  // *** MODIFIED MESSAGE TEMPLATE ***
  const message = `
## <@&1444803066418171914> — __**[${spanish.word}](${spanish.link})**__
> **Definition:** ${spanish.definition}
> 
> **Sinónimos:** ${spanish.synonym}
> 
> **Ejemplo:** ${spanish.example}
  `.trim();

  await sendToDiscord(message);
  console.log("Sent Spanish message to Discord:");
  console.log(message);
}

main().catch(console.error);
