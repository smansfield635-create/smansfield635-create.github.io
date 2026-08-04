const DEFAULT_SOURCE = "/laws/research/methods-and-models/showroom.js";
const SOURCE_HOLD = "ARCHITECTURE PRESERVED · ORIGINAL CONTROLLING SOURCE UNDER RECOVERY";

function findExpressionEnd(source, start) {
  let round = 0;
  let square = 0;
  let curly = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let seenOpen = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "(") { round += 1; seenOpen = true; }
    else if (char === ")") round -= 1;
    else if (char === "[") { square += 1; seenOpen = true; }
    else if (char === "]") square -= 1;
    else if (char === "{") { curly += 1; seenOpen = true; }
    else if (char === "}") curly -= 1;

    if (seenOpen && round === 0 && square === 0 && curly === 0) return index;
  }
  throw new Error("METHODS_FAMILIES_EXPRESSION_UNTERMINATED");
}

export function extractCatalogFromSourceText(source) {
  if (typeof source !== "string" || !source.length) throw new TypeError("METHODS_SOURCE_TEXT_REQUIRED");
  const declaration = "const families = ";
  const declarationIndex = source.indexOf(declaration);
  if (declarationIndex < 0) throw new Error("METHODS_FAMILIES_DECLARATION_NOT_FOUND");
  const expressionStart = declarationIndex + declaration.length;
  const expressionEnd = findExpressionEnd(source, expressionStart);
  const expression = source.slice(expressionStart, expressionEnd + 1).trim();
  const families = Function("SOURCE_HOLD", `"use strict"; return (${expression});`)(SOURCE_HOLD);

  if (!Array.isArray(families)) throw new Error("METHODS_FAMILIES_NOT_ARRAY");
  return families;
}

export async function loadCanonicalCatalog(sourceUrl = DEFAULT_SOURCE) {
  const response = await fetch(sourceUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`METHODS_SOURCE_FETCH_FAILED:${response.status}`);
  return extractCatalogFromSourceText(await response.text());
}

export const CANONICAL_METHODS_SOURCE = DEFAULT_SOURCE;
