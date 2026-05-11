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
 *   node scripts/convert-md-to-kajabi-html.mjs           # Convert only
 *   node scripts/convert-md-to-kajabi-html.mjs --preview # Convert + open preview
 *   yarn convert-curriculum
 *   yarn convert-curriculum --preview
 */

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';

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

// Files to exclude from preview (not actual lessons)
const PREVIEW_EXCLUDE = [
  'transcript.html',
  'ASSIGNMENTS.html',
  'README.html',
  'kajabi-embed-template.html',
  'AI-REFERENCE.html',
];

// Directories to exclude from preview
const PREVIEW_EXCLUDE_DIRS = [
  '99-cheat-codes',
];

// Recursively find all .html files in a directory
function findHtmlFiles(dir, isRoot = true) {
  const files = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip excluded directories
      if (PREVIEW_EXCLUDE_DIRS.includes(item)) continue;
      files.push(...findHtmlFiles(fullPath, false));
    } else if (stat.isFile() && item.endsWith('.html')) {
      // Skip excluded files
      if (PREVIEW_EXCLUDE.includes(item)) continue;
      files.push(fullPath);
    }
  }

  // Natural sort: 1, 2, 10 instead of 1, 10, 2
  return files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

// Generate the preview HTML page
function generatePreview(curriculumDir) {
  const htmlFiles = findHtmlFiles(curriculumDir);
  const projectRoot = path.join(__dirname, '..');
  const previewPath = path.join(projectRoot, 'curriculum-preview.html');

  // Build the pages data
  const pages = htmlFiles.map((filePath, index) => {
    const relativePath = path.relative(curriculumDir, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      path: relativePath,
      content: content,
      index: index
    };
  });

  const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Curriculum Preview</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
    }
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #1a1a2e;
      color: white;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .nav-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav button {
      background: #4a4a6a;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .nav button:hover:not(:disabled) {
      background: #6a6a8a;
    }
    .nav button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .nav select {
      padding: 8px 12px;
      border-radius: 6px;
      border: none;
      font-size: 14px;
      max-width: 400px;
      background: #4a4a6a;
      color: white;
    }
    .nav .page-info {
      font-size: 14px;
      color: #aaa;
    }
    .content {
      margin-top: 70px;
      padding: 40px;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }
    .content-wrapper {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }
    .file-path {
      background: #e8e8e8;
      padding: 8px 12px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 13px;
      margin-bottom: 20px;
      color: #666;
    }
    /* Content styles */
    .content-wrapper h1 { font-size: 2em; margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    .content-wrapper h2 { font-size: 1.5em; margin-top: 1.5em; color: #333; }
    .content-wrapper h3 { font-size: 1.2em; margin-top: 1.2em; color: #444; }
    .content-wrapper pre {
      background: #1a1a2e;
      color: #e8e8e8;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 14px;
    }
    .content-wrapper code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .content-wrapper pre code {
      background: none;
      padding: 0;
    }
    .content-wrapper ul, .content-wrapper ol {
      padding-left: 24px;
    }
    .content-wrapper li {
      margin: 8px 0;
    }
    .content-wrapper a {
      color: #0066cc;
    }
    .content-wrapper iframe {
      max-width: 100%;
      border-radius: 8px;
      margin: 20px 0;
    }
    .content-wrapper hr {
      border: none;
      border-top: 1px solid #eee;
      margin: 30px 0;
    }
    .content-wrapper blockquote {
      border-left: 4px solid #ddd;
      margin: 20px 0;
      padding-left: 20px;
      color: #666;
    }
    .keyboard-hint {
      font-size: 12px;
      color: #888;
    }
    .keyboard-hint kbd {
      background: #4a4a6a;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <nav class="nav">
    <div class="nav-controls">
      <button id="prev" onclick="prevPage()">← Prev</button>
      <select id="pageSelect" onchange="goToPage(this.value)"></select>
      <button id="next" onclick="nextPage()">Next →</button>
    </div>
    <div class="page-info">
      <span id="pageNum"></span>
      <span class="keyboard-hint">Use <kbd>←</kbd> <kbd>→</kbd> arrow keys</span>
    </div>
  </nav>

  <div class="content">
    <div class="file-path" id="filePath"></div>
    <div class="content-wrapper" id="pageContent"></div>
  </div>

  <script>
    const pages = ${JSON.stringify(pages)};
    let currentPage = 0;

    function renderPage() {
      const page = pages[currentPage];
      document.getElementById('pageContent').innerHTML = page.content;
      document.getElementById('filePath').textContent = page.path;
      document.getElementById('pageNum').textContent = \`Page \${currentPage + 1} of \${pages.length}\`;
      document.getElementById('prev').disabled = currentPage === 0;
      document.getElementById('next').disabled = currentPage === pages.length - 1;
      document.getElementById('pageSelect').value = currentPage;

      // Scroll to top
      window.scrollTo(0, 0);

      // Update URL hash
      history.replaceState(null, '', '#' + currentPage);
    }

    function prevPage() {
      if (currentPage > 0) {
        currentPage--;
        renderPage();
      }
    }

    function nextPage() {
      if (currentPage < pages.length - 1) {
        currentPage++;
        renderPage();
      }
    }

    function goToPage(index) {
      currentPage = parseInt(index);
      renderPage();
    }

    // Populate select dropdown
    const select = document.getElementById('pageSelect');
    pages.forEach((page, i) => {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = page.path;
      select.appendChild(option);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
    });

    // Load from hash if present
    const hash = window.location.hash.slice(1);
    if (hash && !isNaN(parseInt(hash))) {
      currentPage = Math.min(Math.max(0, parseInt(hash)), pages.length - 1);
    }

    renderPage();
  </script>
</body>
</html>`;

  fs.writeFileSync(previewPath, previewHtml, 'utf-8');
  console.log(`\n📄 Preview generated: curriculum-preview.html`);

  return previewPath;
}

// Open the preview in the default browser
function openPreview(previewPath) {
  const platform = process.platform;
  let cmd;

  if (platform === 'darwin') {
    cmd = `open "${previewPath}"`;
  } else if (platform === 'win32') {
    cmd = `start "" "${previewPath}"`;
  } else {
    cmd = `xdg-open "${previewPath}"`;
  }

  exec(cmd, (error) => {
    if (error) {
      console.log(`\n💡 Open manually: file://${previewPath}`);
    } else {
      console.log(`\n🌐 Preview opened in browser`);
    }
  });
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const shouldPreview = args.includes('--preview');

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

  // Generate and open preview if requested
  if (shouldPreview) {
    const previewPath = generatePreview(curriculumDir);
    openPreview(previewPath);
  } else {
    console.log(`\n💡 Tip: Run with --preview to open an interactive preview`);
  }
}

// Run the script
main();

export { convertMdToHtml, findMarkdownFiles };
