# DataFormatX 💠

**The Intelligent, Private File Converter.**

## What is this?

DataFormatX uses AI to convert files between complex data formats (JSON, XML, CSV) or documents (Markdown, HTML, LaTeX) directly in your browser.

It is designed with a **Local-First** architecture:
*   **Private:** Data never leaves your machine (if using Local LLMs) or goes strictly to your chosen provider (Gemini/OpenAI).
*   **Secure:** We do not store, log, or cache your files.
*   **No Middleman:** You bring your own keys/models.

## Quick Start

**Run instantly (No install required):**
```bash
npx dataformatx
```

**Or run from source:**
```bash
git clone https://github.com/your-username/dataformatx.git
cd dataformatx
npm install
npm start
```

## Privacy & Security

1.  **Processing:** All data parsing and UI rendering happens locally in your browser.
2.  **AI Providers:**
    *   **Local LLMs (Ollama/LM Studio):** Data never leaves your network.
    *   **Gemini/OpenAI:** Data is sent directly to the provider for conversion only.
3.  **Storage:** API Keys are stored in your browser's `localStorage`.
4.  **Analytics:** This tool contains zero telemetry or tracking.

## License

MIT.
