import * as pdfjs from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Use a more reliable worker loading strategy via CDN for Vercel production
const PDFJS_VERSION = '4.0.379'; 
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

async function renderPageToDataUrl(page: any): Promise<string> {
  const viewport = page.getViewport({ scale: 1.5 }); // Balanced scale for OCR speed
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
  // Initialize PDF.js with the array buffer
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  const maxPages = Math.min(pdf.numPages, 5); // Reduced for Vercel performance
  
  for (let i = 1; i <= maxPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      
      if (pageText.trim()) {
        fullText += pageText + '\n\n';
      }
    } catch (pageErr) {
      console.warn(`Text extraction failed for page ${i}:`, pageErr);
    }
  }
  
  // OCR Fallback using CDN-hosted Tesseract worker for Vercel stability
  if (fullText.trim().length < 50) {
    console.log('Insufficient text found. Attempting CDN-stabilized OCR...');
    
    // Explicitly define CDN paths to avoid 404s on Vercel
    const worker = await createWorker('eng', 1, {
      workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js',
      corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0/tesseract-core.wasm.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      logger: m => console.log(m)
    });
    
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
