import { getStructuredIndexEntries } from "../alpha-index";
import sql from "./db.ts";

async function seedAlpha() {
  const data = await getStructuredIndexEntries();

  // has to be sequential
  // parent has to be saved before it can be referenced
  for (let entry of data) {
    await sql`
        INSERT INTO "AlphaEntry" 
          (id, "updatedAt", title, code, see, "seeAlso", manif, "subCat", "seeCat", "parentId")
        VALUES 
          (${entry.id}, now(), ${entry.title}, ${entry.code}, ${entry.see}, ${entry.seeAlso}, ${entry.manif}, ${entry.subcat}, ${entry.seecat}, ${entry.parentId})  
    `;
  }
}

// await seedAlpha();
