import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY environment variable is missing.');
  console.error('Usage: GEMINI_API_KEY=your_key node scripts/generate-seo-descriptions.js');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const toolsJsonPath = path.resolve('tools.json');
const progressFile = path.resolve('scripts/seo-progress.json');

let progress = {};
if (fs.existsSync(progressFile)) {
  progress = JSON.parse(fs.readFileSync(progressFile, 'utf-8'));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function updateToolDescription(toolId, tool) {
  if (progress[toolId]) {
    console.log(`Skipping ${toolId} (${tool.name}) - already processed.`);
    return true;
  }

  const prompt = `You are an expert SEO copywriter. Write a highly optimized, compelling meta description for a web tool.

Tool Name: ${tool.name}
Keywords: ${tool.keywords}
Current Description: ${tool.description}

Requirements:
1. Length: 70-120 characters (in Chinese).
2. Must include core keywords naturally.
3. Highlight that it is "在线" (online), "免费" (free), or "本地处理/不上传数据" (local/no data upload) if applicable.
4. Output ONLY the raw description text, without quotes, prefixes, or explanations.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    let newDesc = response.text.trim();
    // Clean up if the model returned quotes
    newDesc = newDesc.replace(/^["']|["']$/g, '');

    console.log(`[${toolId}] ${tool.name}\n  Old: ${tool.description}\n  New: ${newDesc}\n`);

    // 1. Update tools.json in memory
    tool.description = newDesc;

    // 2. Update the HTML file
    const htmlPath = path.resolve(tool.path);
    if (fs.existsSync(htmlPath)) {
      let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
      // replace <meta name="description" content="...">
      htmlContent = htmlContent.replace(
        /<meta name="description" content="[^"]*"/,
        `<meta name="description" content="${newDesc}"`
      );
      // also replace og:description and twitter:description
      htmlContent = htmlContent.replace(
        /<meta property="og:description" content="[^"]*"/,
        `<meta property="og:description" content="${newDesc}"`
      );
      htmlContent = htmlContent.replace(
        /<meta name="twitter:description" content="[^"]*"/,
        `<meta name="twitter:description" content="${newDesc}"`
      );

      fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
    }

    // Save progress
    progress[toolId] = newDesc;
    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));

    return true;
  } catch (error) {
    console.error(`Error generating for ${toolId}: ${error.message}`);
    return false;
  }
}

async function run() {
  const data = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf-8'));
  const tools = data.tools;
  const toolIds = Object.keys(tools);

  console.log(`Starting SEO description generation for ${toolIds.length} tools...`);

  for (let i = 0; i < toolIds.length; i++) {
    const toolId = toolIds[i];
    const tool = tools[toolId];

    const success = await updateToolDescription(toolId, tool);
    if (success) {
      // Save tools.json periodically or at the end
      fs.writeFileSync(toolsJsonPath, JSON.stringify(data, null, 2), 'utf-8');
    }

    // Rate limit: 2 requests per second for standard free tier is safe
    await sleep(500);
  }

  // Format the JSON to ensure it matches the repo's prettier rules
  console.log("Done! Run 'npm run format' to format the modified files.");
}

run();
