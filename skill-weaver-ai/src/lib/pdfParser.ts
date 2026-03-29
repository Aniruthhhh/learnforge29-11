import * as pdfjs from 'pdfjs-dist';

// Use a more reliable worker loading strategy
const PDFJS_VERSION = '5.5.207'; 
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

export async function extractTextFromPdf(file: File): Promise<string> {
  console.log(`Extracting text from PDF: ${file.name} (${file.size} bytes)`);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  // Increased page limit for larger documents
  const maxPages = Math.min(pdf.numPages, 20); 
  
  for (let i = 1; i <= maxPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      // Join strings with space and trim individual parts
      const pageText = content.items
        .map((item: any) => item.str.trim())
        .filter((str: string) => str.length > 0)
        .join(' ');
      
      // Basic text cleaning: strip multiple spaces and hidden characters
      const cleanedPageText = pageText.replace(/\s\s+/g, ' ').replace(/[^\x20-\x7E\n]/g, '');
      fullText += cleanedPageText + '\n\n'; // Use double newline for page separation
    } catch (pageErr) {
      console.warn(`Could not extract page ${i}:`, pageErr);
      continue; // Skip failed pages but continue extraction
    }
  }
  
  console.log(`Completed PDF extraction. Total characters: ${fullText.length}`);
  const finalContent = fullText.trim();
  
  if (finalContent.length === 0) {
    throw new Error('PDF extraction returned no text. The document might be scanned/image-based.');
  }
  
  return finalContent;
}
