declare module "pdf-parse" {
  export default function pdfParse(
    dataBuffer: Buffer | Uint8Array
  ): Promise<{ text: string }>;
}
