const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractText(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  let fullText = '';
  
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(' ') + '\n\n';
  }
  
  return fullText;
}

extractText('plan/Banking_Microservices_Assignment.pdf')
  .then(text => {
    fs.writeFileSync('plan/assignment.txt', text);
    console.log('Done. Length:', text.length);
  })
  .catch(err => console.error(err));
