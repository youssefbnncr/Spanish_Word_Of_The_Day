import fetch from "node-fetch";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

// ---------------------
//   HELPER FUNCTION TO RETRY UNTIL VALID DEFINITION
// ---------------------
async function getValidWord(language) {
  const urlWordApi =
    language === "en"
      ? "https://random-word-api.herokuapp.com/word"
      : "https://random-word-api.herokuapp.com/word?lang=es";

  const urlDictApi = (word) =>
    language === "en"
      ? `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      : `https://api.dictionaryapi.dev/api/v2/entries/es/${word}`;

  let retries = 0;
  while (retries < 10) {
    // try max 10 times
    const wordRes = await fetch(urlWordApi);
    const [word] = await wordRes.json();

    try {
      const dictRes = await fetch(urlDictApi(word));
      const dictData = await dictRes.json();

      const entry = dictData[0]?.meanings?.[0];
      const definition = entry?.definitions?.[0]?.definition;
      if (!definition) throw new Error("No definition");

      const example =
        entry?.definitions?.[0]?.example || "No example available.";
      const synonym =
        entry?.synonyms?.[0] ||
        entry?.definitions?.[0]?.synonyms?.[0] ||
        "None";

      return { word, definition, example, synonym };
    } catch (err) {
      retries++;
      continue; // try another word
    }
  }

  // fallback if no valid word found
  return {
    word: language === "en" ? "typify" : "desatracar",
    definition: "No definition available.",
    example: "No example available.",
    synonym: "None",
  };
}

// ---------------------
//   SEND TO DISCORD
// ---------------------
async function sendToDiscord(message) {
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  });
}

// ---------------------
//   MAIN MESSAGE BUILDER
// ---------------------
async function main() {
  const english = await getValidWord("en");
  const spanish = await getValidWord("es");

  const message = `
**🇪🇸 Spanish Word Of The Day**
**${spanish.word}:** ${spanish.definition} 
**Sinónimos:** ${spanish.synonym}
**Ejemplo:** ${spanish.example}

**🇬🇧 English Word Of The Day**
**${english.word}:** ${english.definition}
**Synonyms:** ${english.synonym}
**Usage:** ${english.example}
  `.trim();

  await sendToDiscord(message);
  console.log("Sent message to Discord:");
  console.log(message);
}

main().catch(console.error);
