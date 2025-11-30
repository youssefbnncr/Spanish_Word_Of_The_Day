import fetch from "node-fetch";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

// ---------------------
//   HARDCODED WORD DATA (Option 1 Solution)
// ---------------------
const wordData = [
  // --- English Words ---
  {
    language: "en",
    word: "Ephemeral",
    definition: "Lasting for a very short time.",
    example: "The beauty of a sunset is often considered ephemeral.",
    synonym: "Transient",
  },
  {
    language: "en",
    word: "Mellifluous",
    definition: "A sound that is sweet and musical; pleasant to hear.",
    example: "The singer's mellifluous voice captivated the audience.",
    synonym: "Dulcet",
  },
  {
    language: "en",
    word: "Ubiquitous",
    definition: "Present, appearing, or found everywhere.",
    example: "In the modern age, smartphones have become ubiquitous.",
    synonym: "Omnipresent",
  },
  {
    language: "en",
    word: "Serendipity",
    definition:
      "The occurrence and development of events by chance in a happy or beneficial way.",
    example:
      "It was pure serendipity that she found the exact book she needed in a tiny, obscure shop.",
    synonym: "Chance",
  },
  {
    language: "en",
    word: "Quixotic",
    definition: "Exceedingly idealistic; unrealistic and impractical.",
    example:
      "Launching a mission to Mars with only amateur equipment was a quixotic venture.",
    synonym: "Impractical",
  },
  {
    language: "en",
    word: "Languid",
    definition:
      "Displaying or having a disinclination for physical exertion or effort; slow and relaxed.",
    example: "They spent a languid afternoon by the pool, sipping lemonade.",
    synonym: "Lethargic",
  },
  {
    language: "en",
    word: "Susurrus",
    definition: "A whispering, rustling, or murmuring sound.",
    example:
      "The only sound was the gentle susurrus of the breeze through the leaves.",
    synonym: "Whispering",
  },
  {
    language: "en",
    word: "Capricious",
    definition:
      "Given to sudden and unaccountable changes of mood or behavior.",
    example:
      "The weather in the mountains is notoriously capricious, changing every few hours.",
    synonym: "Fickle",
  },
  {
    language: "en",
    word: "Ebullient",
    definition: "Cheerful and full of energy.",
    example:
      "The team was in an ebullient mood after winning the championship.",
    synonym: "Jubilant",
  },
  {
    language: "en",
    word: "Ineffable",
    definition: "Too great or extreme to be expressed or described in words.",
    example: "The beauty of the aurora borealis was simply ineffable.",
    synonym: "Indescribable",
  },

  // --- Spanish Words ---
  {
    language: "es",
    word: "Efímero",
    definition: "Que dura por muy poco tiempo.",
    example: "La belleza de las flores es efímera, dura solo unos días.",
    synonym: "Pasajero",
  },
  {
    language: "es",
    word: "Inefable",
    definition: "Que no puede explicarse con palabras.",
    example:
      "Sintió una alegría inefable al ver a su familia después de tanto tiempo.",
    synonym: "Indescriptible",
  },
  {
    language: "es",
    word: "Taciturno",
    definition: "Callado, silencioso, reservado.",
    example:
      "Después de la noticia, el hombre se quedó taciturno durante toda la cena.",
    synonym: "Melancólico",
  },
  {
    language: "es",
    word: "Hilarante",
    definition: "Que inspira gran alegría o produce una risa ruidosa.",
    example:
      "La comedia de anoche fue tan hilarante que me dolía el estómago de tanto reír.",
    synonym: "Gracioso",
  },
  {
    language: "es",
    word: "Recíproco",
    definition: "Que se da o se dirige a otro, y a la vez se recibe de él.",
    example: "La admiración entre los dos artistas era recíproca.",
    synonym: "Mutuo",
  },
  {
    language: "es",
    word: "Efervescente",
    definition: "Que produce burbujas; fig., que es animado o entusiasta.",
    example: "La ciudad se vuelve efervescente durante las fiestas de verano.",
    synonym: "Espumoso",
  },
  {
    language: "es",
    word: "Ineludible",
    definition: "Que no se puede evitar.",
    example:
      "El pago de impuestos es un compromiso ineludible para todo ciudadano.",
    synonym: "Obligatorio",
  },
  {
    language: "es",
    word: "Sempiterno",
    definition: "Que durará siempre; que no tendrá fin.",
    example: "La creencia en el amor sempiterno es muy romántica.",
    synonym: "Eterno",
  },
  {
    language: "es",
    word: "Inopinado",
    definition: "Que sucede sin haber sido pensado o previsto.",
    example: "La lluvia inopinada arruinó la barbacoa al aire libre.",
    synonym: "Imprevisto",
  },
  {
    language: "es",
    word: "Perenne",
    definition: "Permanente, constante, que dura mucho tiempo.",
    example: "El roble es un árbol perenne que conserva sus hojas todo el año.",
    synonym: "Constante",
  },
];

// ---------------------
//   HELPER FUNCTION TO GET VALID DEFINITION (NOW PULLS FROM ARRAY)
// ---------------------
async function getValidWord(language) {
  // Filter the array to get only words for the desired language
  const wordsForLang = wordData.filter((w) => w.language === language);

  // Select a random index
  const randomIndex = Math.floor(Math.random() * wordsForLang.length);

  // Return the selected word object
  const wordObject = wordsForLang[randomIndex];

  return {
    word: wordObject.word,
    definition: wordObject.definition,
    example: wordObject.example,
    synonym: wordObject.synonym,
  };
}

// ---------------------
//   SEND TO DISCORD (No change needed)
// ---------------------
async function sendToDiscord(message) {
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
//   MAIN MESSAGE BUILDER (No change needed)
// ---------------------
async function main() {
  // The structure of the objects returned by getValidWord is the same,
  // so the rest of the code works perfectly.
  const english = await getValidWord("en");
  const spanish = await getValidWord("es");

  const message = `
**🇪🇸 Spanish Word Of The Day**
**${spanish.word}**: ${spanish.definition}
**Sinónimos**: ${spanish.synonym}
**Ejemplo**: ${spanish.example}

---

**🇬🇧 English Word Of The Day**
**${english.word}**: ${english.definition}
**Synonyms**: ${english.synonym}
**Usage**: ${english.example}
  `.trim();

  await sendToDiscord(message);
  console.log("Sent message to Discord:");
  console.log(message);
}

main().catch(console.error);
