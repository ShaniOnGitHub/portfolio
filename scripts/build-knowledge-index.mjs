// scripts/build-knowledge-index.mjs
// Run with: node scripts/build-knowledge-index.mjs
// Re-run any time you update PersonalData.pdf

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "@xenova/transformers";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PDF_PATH = path.resolve(ROOT, "..", "PersonalData.pdf");
const OUT_PATH = path.resolve(ROOT, "src", "data", "knowledge-index.json");

// ─── PDF parsing ────────────────────────────────────────────────────────────
async function extractQAPairs(pdfPath) {
  const buffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse();
  const data = await parser.lazyLoadPage(buffer).catch(async () => {
    // fallback: try parseBuffer
    const p2 = new PDFParse();
    return p2.pdf(buffer);
  });
  // PDFParse v2 API: use getPagesText or pdfText
  let text = "";
  if (data && data.text) {
    text = data.text;
  } else if (data && data.Pages) {
    text = data.Pages.map((p) => p.Texts?.map((t) => decodeURIComponent(t.R?.[0]?.T ?? "")).join(" ") ?? "").join("\n");
  }

  const pairs = [];

  // Strategy: split on lines starting with "Q:" or numbered "1." style patterns
  // Try Q:/A: pattern first
  const qaRegex = /Q:\s*(.+?)\s*\nA:\s*([\s\S]+?)(?=\nQ:|\n\d+\.|$)/g;
  let match;
  while ((match = qaRegex.exec(text)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim();
    if (question && answer) {
      pairs.push({ question, answer });
    }
  }

  // If Q:/A: pattern yields nothing, try numbered Q&A pattern
  if (pairs.length === 0) {
    const numbered = /\d+\.\s+(.+?)\?[\s\n]+([^\d]+?)(?=\d+\.|$)/g;
    while ((match = numbered.exec(text)) !== null) {
      const question = (match[1].trim() + "?").replace(/\s+/g, " ");
      const answer = match[2].trim().replace(/\s+/g, " ");
      if (question && answer && answer.length > 10) {
        pairs.push({ question, answer });
      }
    }
  }

  // If still nothing, split on double newlines and pair consecutive chunks
  if (pairs.length === 0) {
    console.warn("⚠ Could not parse Q/A structure — falling back to paragraph chunks");
    const paragraphs = text
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 30);
    for (let i = 0; i < paragraphs.length - 1; i += 2) {
      pairs.push({ question: paragraphs[i], answer: paragraphs[i + 1] ?? paragraphs[i] });
    }
    if (paragraphs.length % 2 !== 0) {
      const last = paragraphs[paragraphs.length - 1];
      pairs.push({ question: last, answer: last });
    }
  }

  return pairs;
}

// ─── Embedding ───────────────────────────────────────────────────────────────
async function embedTexts(texts, extractor) {
  const output = await extractor(texts, { pooling: "mean", normalize: true });
  return output.tolist ? output.tolist() : Array.from(output.data).reduce((acc, _, i) => {
    const dim = output.dims[1];
    if (i % dim === 0) acc.push(Array.from(output.data.slice(i, i + dim)));
    return acc;
  }, []);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("📄 Parsing PDF:", PDF_PATH);
  const pairs = await extractQAPairs(PDF_PATH);
  console.log(`✅ Extracted ${pairs.length} Q&A pairs`);

  if (pairs.length === 0) {
    console.error("❌ No Q&A pairs found. Check your PDF format.");
    process.exit(1);
  }

  console.log("\n🤖 Loading embedding model (Xenova/all-MiniLM-L6-v2)...");
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("✅ Model loaded");

  // Embed: concatenate Q + A so the vector captures both question phrasing AND answer content
  const textsToEmbed = pairs.map((p) => `${p.question} ${p.answer}`);

  console.log(`\n⚡ Generating ${pairs.length} embeddings...`);
  const BATCH = 16;
  const allVectors = [];
  for (let i = 0; i < textsToEmbed.length; i += BATCH) {
    const batch = textsToEmbed.slice(i, i + BATCH);
    const vecs = await embedTexts(batch, extractor);
    allVectors.push(...vecs);
    process.stdout.write(`  ${Math.min(i + BATCH, textsToEmbed.length)}/${textsToEmbed.length}\r`);
  }
  console.log("\n✅ Embeddings done");

  const index = pairs.map((p, i) => ({
    question: p.question,
    answer: p.answer,
    vector: allVectors[i],
  }));

  // Write output
  const outDir = path.dirname(OUT_PATH);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(index, null, 2));
  console.log(`\n🎉 Index written to: ${OUT_PATH}`);
  console.log(`   ${index.length} chunks, vector dim: ${index[0]?.vector?.length ?? "?"}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
