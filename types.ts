export enum FormatType {
  MARKDOWN = 'Markdown',
  HTML = 'HTML',
  TEXT = 'Plain Text',
  JSON = 'JSON',
  CSV = 'CSV',
  XML = 'XML',
  YAML = 'YAML',
  LATEX = 'LaTeX',
  DOCX_TEXT = 'Docx Content', // Represented as text structure
}

export interface ConversionOption {
  value: FormatType;
  label: string;
  category: 'Document' | 'Data';
  extension: string;
  mimeType: string;
}

export interface ConversionResult {
  content: string;
  success: boolean;
  error?: string;
}

export type LLMProvider = 'gemini' | 'openai';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}