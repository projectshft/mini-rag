#!/usr/bin/env node

/**
 * Convert Markdown files to Kajabi-compatible HTML
 *
 * This script converts all .md files in the curriculum/ directory
 * (or 15-applied-ai/ as fallback) to clean HTML for Kajabi.
 *
 * Output format: Just the body content (no DOCTYPE, head, or styles)
 * Kajabi handles the document structure itself.
 *
 * Usage:
 *   node scripts/convert-md-to-kajabi-html.mjs
 *   yarn convert-curriculum
 */

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure marked for clean HTML output
marked.setOptions({
  headerIds: true,
  mangle: false,
  breaks: true,
  gfm: true, // GitHub Flavored Markdown
});

// For Kajabi, we just need the body content - no DOCTYPE, head, or styles
// Kajabi handles the document structure itself
function formatForKajabi(html) {
  return html.trim();
}

// Process a single markdown file
function convertMdToHtml(mdFilePath) {
  try {
    // Read markdown file
    const markdown = fs.readFileSync(mdFilePath, 'utf-8');

    // Convert to HTML
    const htmlContent = marked.parse(markdown);

    // Format for Kajabi (just the content, no wrapper)
    const kajabiHtml = formatForKajabi(htmlContent);

    // Determine output path
    const htmlFilePath = mdFilePath.replace(/\.md$/, '.html');

    // Write HTML file
    fs.writeFileSync(htmlFilePath, kajabiHtml, 'utf-8');

    console.log(`✅ Converted: ${path.relative(process.cwd(), mdFilePath)} → ${path.basename(htmlFilePath)}`);

    return htmlFilePath;
  } catch (error) {
    console.error(`❌ Error converting ${mdFilePath}:`, error.message);
    return null;
  }
}

// Recursively find all .md files in a directory
function findMarkdownFiles(dir) {
  const files = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recurse into subdirectories
      files.push(...findMarkdownFiles(fullPath));
    } else if (stat.isFile() && item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Main function
function main() {
  // Try curriculum/ first, fall back to 15-applied-ai/
  let curriculumDir = path.join(__dirname, '..', 'curriculum');

  if (!fs.existsSync(curriculumDir)) {
    curriculumDir = path.join(__dirname, '..', '15-applied-ai');
  }

  if (!fs.existsSync(curriculumDir)) {
    console.error(`❌ Directory not found. Expected either 'curriculum/' or '15-applied-ai/'`);
    process.exit(1);
  }

  const dirName = path.basename(curriculumDir);
  console.log(`🔄 Converting Markdown files to Kajabi-compatible HTML from ${dirName}/...\n`);

  // Find all markdown files
  const mdFiles = findMarkdownFiles(curriculumDir);

  console.log(`📁 Found ${mdFiles.length} Markdown files\n`);

  // Convert each file
  let successCount = 0;
  let errorCount = 0;

  for (const mdFile of mdFiles) {
    const result = convertMdToHtml(mdFile);
    if (result) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  console.log(`\n✨ Conversion complete!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`\n📂 HTML files created alongside .md files in: ${dirName}/`);
}

// Run the script
main();

export { convertMdToHtml, findMarkdownFiles };
