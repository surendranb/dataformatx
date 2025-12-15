import { FormatType, ConversionOption } from './types';

export const SUPPORTED_FORMATS: ConversionOption[] = [
  // Data
  { value: FormatType.JSON, label: 'JSON', category: 'Data', extension: 'json', mimeType: 'application/json' },
  { value: FormatType.CSV, label: 'CSV', category: 'Data', extension: 'csv', mimeType: 'text/csv' },
  { value: FormatType.XML, label: 'XML', category: 'Data', extension: 'xml', mimeType: 'application/xml' },
  { value: FormatType.YAML, label: 'YAML', category: 'Data', extension: 'yaml', mimeType: 'text/yaml' },
  { value: FormatType.SQL, label: 'SQL', category: 'Data', extension: 'sql', mimeType: 'application/sql' },
  
  // Document
  { value: FormatType.MARKDOWN, label: 'Markdown', category: 'Document', extension: 'md', mimeType: 'text/markdown' },
  { value: FormatType.HTML, label: 'HTML', category: 'Document', extension: 'html', mimeType: 'text/html' },
  { value: FormatType.TEXT, label: 'Plain Text', category: 'Document', extension: 'txt', mimeType: 'text/plain' },
  { value: FormatType.LATEX, label: 'LaTeX', category: 'Document', extension: 'tex', mimeType: 'application/x-tex' },
  
  // Code
  { value: FormatType.PYTHON, label: 'Python', category: 'Code', extension: 'py', mimeType: 'text/x-python' },
  { value: FormatType.JAVASCRIPT, label: 'JavaScript', category: 'Code', extension: 'js', mimeType: 'text/javascript' },
  { value: FormatType.TYPESCRIPT, label: 'TypeScript', category: 'Code', extension: 'ts', mimeType: 'text/typescript' },
];

export const MAX_INPUT_CHARS = 100000; // Roughly 25k tokens, safe for Flash model

export const SAMPLE_DATA = {
  [FormatType.JSON]: `[
  { "id": 1, "name": "Alice", "role": "Engineer" },
  { "id": 2, "name": "Bob", "role": "Designer" }
]`,
  [FormatType.MARKDOWN]: `# Project Title

## Introduction
This is a sample markdown file.

- Item 1
- Item 2`,
  [FormatType.CSV]: `id,name,role
1,Alice,Engineer
2,Bob,Designer`
};