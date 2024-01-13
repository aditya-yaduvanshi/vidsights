import mammoth from "mammoth";
import * as xlsx from "xlsx";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";

const getFileContent = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target?.result;

      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        const csvContent = extractTextFromCsv(content as ArrayBuffer);
        resolve(csvContent);
      } else if (
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx")
      ) {
        const xlsxText = extractTextFromXLSX(content as ArrayBuffer);
        resolve(xlsxText);
      } else if (
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const docText = await extractTextFromDOCX(content as ArrayBuffer);
        resolve(docText);
      } else if (file.type === "application/pdf") {
        const pdfText = await extractTextFromPDF(content as ArrayBuffer);
        resolve(pdfText);
      } else {
        console.log("Unknown file type");
        reject("Unknown file type");
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

const extractTextFromDOCX = async (
  docxContent: ArrayBuffer
): Promise<string> => {
  const { value } = await mammoth.extractRawText({ arrayBuffer: docxContent });
  return value;
};

const extractTextFromPDF = async (pdfContent: ArrayBuffer): Promise<string> => {
  const text: string[] = [];
  const pdf = await pdfjs.getDocument(pdfContent).promise;
  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const content = await page.getTextContent();
    const value = content.items.map((item: any) => item.str).join("");
    text.push(value);
  }
  return text.join("\n");
};

const extractTextFromXLSX = (xlsxContent: ArrayBuffer) => {
  const workbook = xlsx.read(xlsxContent);
  const textContent: string[] = [];

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];

    for (const cellAddress in worksheet) {
      const cell = worksheet[cellAddress];
      if (cell.v) {
        textContent.push(cell.v.toString());
      }
    }
  });

  return textContent.join("\n");
};

const extractTextFromCsv = (csvContent: ArrayBuffer) => {
  const text = new TextDecoder("utf-8").decode(csvContent as ArrayBuffer);
  return text;
};

export default getFileContent;
