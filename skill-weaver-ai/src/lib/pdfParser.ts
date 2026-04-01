import * as pdfjs from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Use a more reliable worker loading strategy
const PDFJS_VERSION = '5.5.207'; 
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

async function renderPageToDataUrl(page: any): Promise<string> {
  const viewport = page.getViewport({ scale: 2.0 }); // High scale for better OCR
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get canvas context');
  
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;

  return canvas.toDataURL('image/png');
}

export async function extractTextFromPdf(file: File): Promise<string> {
  console.log(`Extracting text from PDF: ${file.name} (${file.size} bytes)`);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  // Increased page limit for larger documents
  const maxPages = Math.min(pdf.numPages, 10); // Reduced to 10 for OCR performance
  
  for (let i = 1; i <= maxPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      // Join strings with space and trim individual parts
      const pageText = content.items
        .map((item: any) => item.str.trim())
        .filter((str: string) => str.length > 0)
        .join(' ');
      
      // Improved text cleaning: support Unicode while stripping truly hidden/garbage characters
      const cleanedPageText = pageText.replace(/\s+/g, ' ').trim();
      if (cleanedPageText) {
        fullText += cleanedPageText + '\n\n';
      }
    } catch (pageErr) {
      console.warn(`Could not extract page ${i}:`, pageErr);
      continue; 
    }
  }
  
  // OCR Fallback if no text found
  if (fullText.trim().length === 0) {
    console.log('No text found with standard extraction. Attempting OCR...');
    const worker = await createWorker('eng');
    
    try {
      for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) { // Only OCR first 3 pages for speed
        const page = await pdf.getPage(i);
        const imageUrl = await renderPageToDataUrl(page);
        const { data: { text } } = await worker.recognize(imageUrl);
        fullText += text + '\n\n';
      }
    } finally {
      await worker.terminate();
    }
  }
  
  console.log(`Completed PDF extraction. Total characters: ${fullText.length}`);
  const finalContent = fullText.trim();
  
  if (finalContent.length === 0) {
    throw new Error('PDF extraction returned no text. The document might be scanned/image-based or unsupported.');
  }
  
  return finalContent;
}
