import { type X2jOptions } from "fast-xml-parser";
import { xmlToJson } from "../xml-to-json.ts";

const filePath = "./data/2024/tabular.xml";
const options: X2jOptions = {
  ignoreAttributes: false,
};

const json = await xmlToJson(filePath, options);

const root = json["ICD10CM.tabular"];

// console.log(root)

const chapterList = root["chapter"];

function getDescObject(chapter: any) {
  const descObject = chapter["desc"].split("(");

  return {
    title: descObject[0],
    range: descObject[1].split(")")[0],
  };
}

function getChapterDescription(chapter: any) {
  const chapterKeys = Object.keys(chapter);
  const excludedKeys = ["sectionIndex", "section"];

  const chapterOnlyKeys = chapterKeys.filter(
    (key) => !excludedKeys.includes(key),
  );

  const result: Record<
    | "Description"
    | "Chapter"
    | "Notes"
    | "Includes"
    | "Use Additional Code"
    | "Excludes 1"
    | "Excludes 2",
    string | string[]
  > = {
    Description: "",
    Chapter: "",
    Notes: "",
    Includes: "",
    "Use Additional Code": "",
    "Excludes 1": [],
    "Excludes 2": [],
  };

  for (let key of chapterOnlyKeys) {
    switch (key) {
      case "desc":
        result["Description"] = chapter[key];
        break;
      case "name":
        result["Chapter"] = chapter["name"];
        break;
      case "notes":
        result["Notes"] = chapter['notes']['note'];
        break;
      case "includes":
        result["Includes"] = chapter["includes"]["note"];
        break;
      case "useAdditionalCode":
        result["Use Additional Code"] = chapter["useAdditionalCode"]["note"];
        break;
      case "excludes1":
        result["Excludes 1"] = chapter["excludes1"]["note"];
        break;
      case "excludes2":
        result["Excludes 2"] = chapter["excludes2"]["note"];
        break;
      default:
        throw new Error(`No handler for key ${key}`);
    }
  }

  return result;
}

// chapterList.map(ch => console.log(getDescObject(ch)))

const ff = (f: any) => JSON.stringify(f, null, 2);

chapterList.map((ch) => console.log(getChapterDescription(ch)));
