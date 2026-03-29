import mammoth from 'mammoth';

/**
 * Extracts raw text from a DOCX file using Mammoth.js
 * This converts paragraphs and lists into a clean text stream for AI synthesis.
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  console.log(`Extracting text from DOCX: ${file.name} (${file.size} bytes)`);
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value; // The raw text
    const messages = result.messages; // Any warnings
    
    if (messages.length > 0) {
      console.warn('DOCX Extraction Warnings:', messages);
    }

    console.log(`Completed DOCX extraction. Total characters: ${text.length}`);
    const finalContent = text.trim();

    if (finalContent.length === 0) {
      throw new Error('DOCX extraction returned no text. The document may be empty.');
    }

    return finalContent;
  } catch (error: any) {
    console.error('Mammoth DOCX Error:', error);
    throw new Error(`Failed to read Word document: ${error.message || 'Unknown error'}`);
  }
}
