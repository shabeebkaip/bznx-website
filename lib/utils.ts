import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function unescapeHTML(str: any) {
  if (!str || typeof str !== 'string') return str || "";
  return str
  .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\u00a0/g, " ");
}

export function cleanTitle(str: string) {
  let decoded = unescapeHTML(str);
  if (decoded.startsWith("<p>") && decoded.endsWith("</p>")) {
    decoded = decoded.substring(3, decoded.length - 4);
  }
  return decoded;
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
