export enum FormatType {
  MARKDOWN = 'Markdown',
  HTML = 'HTML',
  TEXT = 'Plain Text',
  JSON = 'JSON',
  CSV = 'CSV',
  XML = 'XML',
  YAML = 'YAML',
  SQL = 'SQL',
  PYTHON = 'Python',
  JAVASCRIPT = 'JavaScript',
  TYPESCRIPT = 'TypeScript',
  LATEX = 'LaTeX',
  DOCX_TEXT = 'Docx Content', // Represented as text structure
}

export interface ConversionOption {
  value: FormatType;
  label: string;
  category: 'Document' | 'Data' | 'Code';
  extension: string;
  mimeType: string;
}

export interface ConversionResult {
  content: string;
  success: boolean;
  error?: string;
}