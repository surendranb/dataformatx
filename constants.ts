import { FormatType, ConversionOption, LLMConfig } from './types';

export const SUPPORTED_FORMATS: ConversionOption[] = [
  // Data
  { value: FormatType.JSON, label: 'JSON', category: 'Data', extension: 'json', mimeType: 'application/json' },
  { value: FormatType.CSV, label: 'CSV', category: 'Data', extension: 'csv', mimeType: 'text/csv' },
  { value: FormatType.XML, label: 'XML', category: 'Data', extension: 'xml', mimeType: 'application/xml' },
  { value: FormatType.YAML, label: 'YAML', category: 'Data', extension: 'yaml', mimeType: 'text/yaml' },
  
  // Document
  { value: FormatType.MARKDOWN, label: 'Markdown', category: 'Document', extension: 'md', mimeType: 'text/markdown' },
  { value: FormatType.HTML, label: 'HTML', category: 'Document', extension: 'html', mimeType: 'text/html' },
  { value: FormatType.TEXT, label: 'Plain Text', category: 'Document', extension: 'txt', mimeType: 'text/plain' },
  { value: FormatType.LATEX, label: 'LaTeX', category: 'Document', extension: 'tex', mimeType: 'application/x-tex' },
];

export const MAX_INPUT_CHARS = 100000; // Roughly 25k tokens

export const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: 'gemini',
  apiKey: '', // User must provide
  baseUrl: '', // Not needed for Gemini default
  model: 'gemini-2.5-flash',
};

export const SAMPLE_DATA = {
  [FormatType.JSON]: `[
  { "id": 1, "name": "Alice", "role": "Engineer" },
  { "id": 2, "name": "Bob", "role": "Designer" }
]`,
  [FormatType.CSV]: `id,name,role
1,Alice,Engineer
2,Bob,Designer`,
  [FormatType.XML]: `<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user id="1">
    <name>Alice</name>
    <role>Engineer</role>
  </user>
  <user id="2">
    <name>Bob</name>
    <role>Designer</role>
  </user>
</users>`,
  [FormatType.YAML]: `- id: 1
  name: Alice
  role: Engineer
- id: 2
  name: Bob
  role: Designer`,
  [FormatType.MARKDOWN]: `# Project Title

## Introduction
This is a sample markdown file.

- Item 1
- Item 2`,
  [FormatType.HTML]: `<!DOCTYPE html>
<html>
<body>
  <h1>Project Title</h1>
  <h2>Introduction</h2>
  <p>This is a sample HTML file.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</body>
</html>`,
  [FormatType.TEXT]: `Project Title
===========

Introduction
------------
This is a sample text file.

* Item 1
* Item 2`,
  [FormatType.LATEX]: `\\documentclass{article}
\\begin{document}
  \\section{Project Title}
  \\subsection{Introduction}
  This is a sample LaTeX file.
  
  \\begin{itemize}
    \\item Item 1
    \\item Item 2
  \\end{itemize}
\\end{document}`
};