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

  // *** FIX APPLIED HERE: Changed the Spanish dictionary URL to use the Spanish endpoint ***
  const urlDictApi = (word) =>
    language === "en"
      ? `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      : `https://api.dictionaryapi.dev/api/v2/entries/es/${word}`; // This endpoint is correct, but coverage might be the issue. Let's stick with it for now and optimize the search/parsing logic.

  let retries = 0;
  while (retries < 10) {
    // try max 10 times
    try {
      const wordRes = await fetch(urlWordApi);
      const [word] = await wordRes.json();

      const dictRes = await fetch(urlDictApi(word));
      const dictData = await dictRes.json();

      // Check if the response is an error object (which happens when no entry is found)
      if (dictData.title === "No Definitions Found") {
        throw new Error("No entry found in dictionary");
      }

      // ** OPTIMIZED PARSING: Accessing the first result, which is an object in the array **
      const entryData = dictData[0];

      // The structure for Spanish might be slightly different. We will check the first meaning.
      const firstMeaning = entryData?.meanings?.[0];

      // Find the definition.
      const definition = firstMeaning?.definitions?.[0]?.definition;
      if (!definition) throw new Error("No definition");

      // Find example and synonym. Spanish synonyms might be in a different place.
      const example =
        firstMeaning?.definitions?.[0]?.example || "No example available.";

      // Spanish synonyms are usually listed at the meaning level or definition level.
      const synonym =
        firstMeaning?.synonyms?.[0] ||
        firstMeaning?.definitions?.[0]?.synonyms?.[0] ||
        "None";

      return { word, definition, example, synonym };
    } catch (err) {
      console.log(
        `Failed to get valid word (Attempt ${retries + 1}):`,
        err.message
      );
      retries++;
      continue; // try another word
    }
  }

  // fallback if no valid word found after 10 retries
  // These words are added for better robustness, as the previous ones may also fail.
  return {
    word: language === "en" ? "typify" : "estético",
    definition:
      language === "en"
        ? "To be characteristic of; to represent."
        : "Perteneciente o relativo a la percepción o apreciación de la belleza.",
    example:
      language === "en"
        ? "The artist's later works typify the cubist movement."
        : "El pintor buscaba un efecto estético en la composición.",
    synonym: language === "en" ? "embody" : "bello",
  };
}

// ---------------------
//   SEND TO DISCORD
// ---------------------
async function sendToDiscord(message) {
  // Use the optional chaining on WEBHOOK_URL in case it's not set for local testing,
  // though it should be set in production environment.
  if (!WEBHOOK_URL) {
    console.error("WEBHOOK_URL is not set. Cannot send to Discord.");
    return;
  }
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
