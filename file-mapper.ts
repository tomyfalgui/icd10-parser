import { dirname, join } from "path";
import { fileURLToPath } from "url";

const FISCAL_YEARS = [2024, 2025] as const;
export type FiscalYear = (typeof FISCAL_YEARS)[number];

function getAbsolutePath(relativePath: string) {
  const baseDir = dirname(fileURLToPath(import.meta.url));
  return join(baseDir, relativePath);
}

const getAlphaIndexPath = (year: 2024 | 2025) =>
  getAbsolutePath(`./data/${year}/alpha-index.xml`);

export const AlphaIndexFiles = FISCAL_YEARS.reduce<Record<FiscalYear, string>>(
  (acc, fy) => {
    acc[fy] = getAlphaIndexPath(fy);
    return acc;
  },
  {} as Record<FiscalYear, string>,
);
