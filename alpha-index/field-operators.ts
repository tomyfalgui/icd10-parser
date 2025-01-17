import { v4 as uuidv4 } from "uuid";

const Attributes = [
  "title",
  "code",
  "see",
  "seeAlso",
  "manif",
  "seecat",
  "subcat",
] as const;

type Attribute = (typeof Attributes)[number];

function isIn(key: Attribute, obj: any) {
  return key in obj;
}

function getTitle(obj: any) {
  return String(obj["title"])
    .replaceAll("<nemod>", "")
    .replaceAll("</nemod>", "");
}

function processSees(str: string) {
  return str.split(",").map((str) => str.trim());
}

export function get(obj: any, attribute: Attribute) {
  if (!isIn(attribute, obj)) return null;

  switch (attribute) {
    case "title":
      return getTitle(obj);
    case "code":
      return obj["code"];
    case "see":
      return processSees(obj["see"]);
    case "seeAlso":
      return processSees(obj["seeAlso"]);
    case "manif":
      return obj["manif"];
    case "seecat":
      return obj["seecat"];
    case "subcat":
      return obj["subcat"];
    default:
      return null;
  }
}

function getAll(obj: any) {
  const ob = Attributes.reduce(
    (acc, curr) => {
      if (!(curr in acc)) {
        acc[curr] = null;
      }

      return acc;
    },
    {} as Record<Attribute, string | Array<string> | null>,
  );

  for (let a of Attributes) {
    ob[a] = get(obj, a);
  }

  return ob;
}

type EntryData = {
  id: string;
  parentId: string | null;
  title: string;
  code: string | null;
  see: string[] | null;
  seeAlso: string[] | null;
  manif: string | null;
  seecat: string | null;
  subcat: string | null;
};

export function recursiveProcess(
  obj: any,
  parentId: string | null = null,
): EntryData[] {
  const currentId = uuidv4();
  let baseObject = [{ ...getAll(obj), id: currentId, parentId }];

  if ("term" in obj) {
    const termObj = obj["term"];

    if (Array.isArray(termObj)) {
      baseObject = [
        ...baseObject,
        ...termObj.flatMap((t) => recursiveProcess(t, currentId)),
      ];
    } else if (typeof termObj === "object") {
      baseObject = [...baseObject, ...recursiveProcess(termObj, currentId)];
    }
  }

  //@ts-ignore
  return baseObject;
}
