import { type X2jOptions } from "fast-xml-parser";
import { AlphaIndexFiles, type FiscalYear } from "../file-mapper.ts";
import { recursiveProcess } from "./field-operators.ts";
import { xmlToJson } from "../xml-to-json";

export async function getStructuredIndexEntries(fy: FiscalYear) {
  const alphaIndexOptions: X2jOptions = {
    ignoreAttributes: true,
    stopNodes: ["*.title"],
  };

  const alphaIndex = await xmlToJson(AlphaIndexFiles[fy], alphaIndexOptions);

  const root = alphaIndex["ICD10CM.index"];
  const letters = root["letter"];
  const terms = [];

  for (let letter of letters) {
    const letterMainTerms = letter.mainTerm;

    for (let mainTerm of letterMainTerms) {
      const termStructure = recursiveProcess(mainTerm);
      terms.push(...termStructure);
    }
  }

  return terms;
}