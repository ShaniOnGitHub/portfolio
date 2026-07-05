// scripts/build-knowledge-index.cjs
// Run with: node scripts/build-knowledge-index.cjs
// Re-run whenever you update PersonalData.pdf

const fs = require("fs");
const path = require("path");

const PDF_PATH = path.resolve(__dirname, "..", "..", "PersonalData.pdf");
const OUT_PATH = path.resolve(__dirname, "..", "src", "data", "knowledge-index.json");
const PUBLIC_PATH = path.resolve(__dirname, "..", "public", "knowledge-index.json");

// ─── PDF text extraction via pdfjs-dist ──────────────────────────────────────
async function extractText(pdfPath) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdfjsWorker = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");

  // Disable worker for Node.js
  pdfjsLib.GlobalWorkerOptions.workerSrc = "";

  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true }).promise;

  let fullText = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => ("str" in item ? item.str : "")).join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}

function parseQAPairs(text) {
  const pairs = [];

  // Strategy 1: Q: / A: pattern
  const qaRegex = /Q:\s*(.+?)\s*\nA:\s*([\s\S]+?)(?=\nQ:|$)/g;
  let match;
  while ((match = qaRegex.exec(text)) !== null) {
    const question = match[1].trim().replace(/\s+/g, " ");
    const answer = match[2].trim().replace(/\s+/g, " ");
    if (question && answer && answer.length > 5) pairs.push({ question, answer });
  }
  if (pairs.length > 0) { console.log("  ✓ Q:/A: pattern"); return pairs; }

  // Strategy 2: "Chunk N — Topic  content" pattern (matches PersonalData.pdf format)
  const chunkRegex = /Chunk\s+\d+\s+[—–-]\s+(.+?)\s{2,}([\s\S]+?)(?=Chunk\s+\d+\s+[—–-]|$)/g;
  while ((match = chunkRegex.exec(text)) !== null) {
    const topic = match[1].trim().replace(/\s+/g, " ");
    const content = match[2].trim().replace(/\s+/g, " ");
    if (topic && content && content.length > 10) {
      // Convert topic into a natural question for better retrieval
      const question = topicToQuestion(topic);
      pairs.push({ question, answer: content });
    }
  }
  if (pairs.length > 0) { console.log(`  ✓ Chunk pattern (${pairs.length} chunks)`); return pairs; }

  // Strategy 3: numbered items "1. Question?\nAnswer"
  const numberedRegex = /(?:^|\n)\d+[.)]\s+(.+?\?)\s*\n([\s\S]+?)(?=\n\d+[.)]|\s*$)/g;
  while ((match = numberedRegex.exec(text)) !== null) {
    const question = match[1].trim().replace(/\s+/g, " ");
    const answer = match[2].trim().replace(/\s+/g, " ");
    if (question && answer && answer.length > 10) pairs.push({ question, answer });
  }
  if (pairs.length > 0) { console.log("  ✓ numbered pattern"); return pairs; }

  // Strategy 4: paragraph pairs
  console.warn("  ⚠ No structure detected — using paragraph chunks");
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim().replace(/\s+/g, " ")).filter(p => p.length > 30);
  for (let i = 0; i < paragraphs.length; i += 2) {
    pairs.push({ question: paragraphs[i], answer: paragraphs[i + 1] ?? paragraphs[i] });
  }
  return pairs;
}

// Map chunk topic labels to natural-language question forms for better semantic matching
function topicToQuestion(topic) {
  const map = {
    "Identity": "Who is Shani? Who is Roshaan Ali Shah?",
    "Current Focus": "What is Shani currently working on? What is his current focus?",
    "DentraFlow": "What is DentraFlow? Tell me about DentraFlow.",
    "Frequenzy": "What is Frequenzy? Tell me about Frequenzy events company.",
    "GDG on Campus": "What is Shani's role at GDG? What is GDGoC SZABIST?",
    "AI Engineering Skills": "What is Shani's AI tech stack? What AI skills does he have?",
    "Support Automation Project": "What AI projects has Shani built? Tell me about his support automation system.",
    "Shan Assistant Project": "What is the Shan AI assistant? Tell me about his multi-model AI project.",
    "RAG Chatbot Project": "What RAG projects has Shani built? Tell me about his RAG chatbot.",
    "Certification": "What certifications does Shani have? Is he IBM certified?",
    "Content & Creative Background": "What is Shani's content background? What creative work has he done?",
    "Community Growth": "How did Shani grow a community? Tell me about his community building.",
    "Contact": "How can I contact Shani? What is his email or LinkedIn?",
    "How this chatbot works": "How does this chatbot work? Is this using AI? How does ShaniGPT work?",
  };
  // Try exact match first, then partial match
  if (map[topic]) return map[topic];
  for (const [key, val] of Object.entries(map)) {
    if (topic.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(topic.toLowerCase())) return val;
  }
  // Generic fallback: convert topic to question
  return `Tell me about ${topic}. What is ${topic}?`;
}


// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const { pipeline } = await import("@xenova/transformers");

  console.log("📄 Parsing PDF:", PDF_PATH);
  const text = await extractText(PDF_PATH);
  console.log(`   Extracted ${text.length} chars`);

  const pdfPairs = parseQAPairs(text);
  console.log(`✅ Found ${pdfPairs.length} raw PDF chunks`);

  // Filter out Chunk 1 (Identity) from PDF since we override it in additional-qa.json
  const filteredPdfPairs = pdfPairs.filter(p => !p.question.includes("Who is Shani?"));

  // Read additional QA pairs
  const addQaPath = path.resolve(__dirname, "..", "src", "data", "additional-qa.json");
  let additionalPairs = [];
  if (fs.existsSync(addQaPath)) {
    additionalPairs = JSON.parse(fs.readFileSync(addQaPath, "utf-8"));
    console.log(`✅ Loaded ${additionalPairs.length} refined Q&A pairs from additional-qa.json`);
  }

  // Merge both lists
  const pairs = [...additionalPairs, ...filteredPdfPairs];
  console.log(`📊 Combined database contains ${pairs.length} Q&A pairs total\n`);

  if (pairs.length === 0) { console.error("❌ No pairs found."); process.exit(1); }

  pairs.slice(0, 3).forEach((p, i) => {
    console.log(`  [${i+1}] Q: ${p.question.slice(0, 70)}`);
    console.log(`       A: ${p.answer.slice(0, 70)}\n`);
  });

  console.log("🤖 Loading Xenova/all-MiniLM-L6-v2...");
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { quantized: true });
  console.log("✅ Model ready\n");

  const texts = pairs.map(p => `${p.question} ${p.answer}`);
  const BATCH = 16;
  const vectors = [];

  console.log(`⚡ Embedding ${pairs.length} chunks...`);
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH);
    const out = await extractor(batch, { pooling: "mean", normalize: true });
    const vecs = out.tolist ? out.tolist() : (() => {
      const dim = out.dims[1];
      return batch.map((_, j) => Array.from(out.data.slice(j * dim, (j + 1) * dim)));
    })();
    vectors.push(...vecs);
    process.stdout.write(`  ${Math.min(i + BATCH, texts.length)}/${texts.length}\r`);
  }
  console.log("\n✅ Done embedding");

  const index = pairs.map((p, i) => {
    // Sanitize answer: Remove roshaani.lovable.app or similar portfolio links cleanly
    let sanitizedAnswer = p.answer.replace(/His portfolio is at roshaani\.lovable\.app\.?/gi, "")
                                   .replace(/Shani's portfolio is available at roshaani\.lovable\.app,? and his code/gi, "Shani's code")
                                   .replace(/roshaani\.lovable\.app/gi, "this portfolio");
    return {
      question: p.question,
      answer: sanitizedAnswer.trim(),
      vector: vectors[i]
    };
  });

  for (const p of [path.dirname(OUT_PATH), path.dirname(PUBLIC_PATH)]) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  }
  fs.writeFileSync(OUT_PATH, JSON.stringify(index));
  fs.writeFileSync(PUBLIC_PATH, JSON.stringify(index));

  console.log(`\n🎉 Index written!`);
  console.log(`   ${index.length} chunks | dim ${index[0]?.vector?.length}`);
  console.log(`   → public/knowledge-index.json (served at /knowledge-index.json)`);
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
