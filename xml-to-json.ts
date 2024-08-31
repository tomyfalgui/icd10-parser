import { type X2jOptions, XMLParser } from "fast-xml-parser";

export async function xmlToJson(fileName: string, options: X2jOptions) {
  const parser = new XMLParser(options);
  const file = Bun.file(fileName);
  const text = await file.text();
  return parser.parse(text);
}
