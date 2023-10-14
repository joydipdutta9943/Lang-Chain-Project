import pdfParser from "pdf-parse";

const parsePdf = async (dataBuffer: Buffer) => {
  const pdf = await pdfParser(dataBuffer);
  const text = pdf.text;

  return text;
}

export default parsePdf;
