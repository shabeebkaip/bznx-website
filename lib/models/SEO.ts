import mongoose, { Schema, Document } from "mongoose";

const TranslatableString = {
  en: { type: String, default: "" },
  ar: { type: String, default: "" }
};

export interface ISEO extends Document {
  page: string;
  metaTitle: { en: string; ar: string };
  metaDescription: { en: string; ar: string };
  metaKeywords?: { en: string; ar: string };
  canonicalUrl?: string;
  ogTitle?: { en: string; ar: string };
  ogDescription?: { en: string; ar: string };
  ogImage?: any;
  robots?: string;
  structuredData?: string;
}

const SEOSchema = new Schema<ISEO>(
  {
    page: { type: String, required: true, unique: true, trim: true },
    metaTitle: TranslatableString,
    metaDescription: TranslatableString,
    metaKeywords: TranslatableString,
    canonicalUrl: { type: String, default: "" },
    ogTitle: TranslatableString,
    ogDescription: TranslatableString,
    ogImage: { type: Schema.Types.Mixed, default: "" },
    robots: { type: String, default: "index, follow" },
    structuredData: { type: String, default: "" },
  },
  { timestamps: true }
);

if (mongoose.models.SEO) {
  delete mongoose.models.SEO;
}

const SEO = mongoose.model<ISEO>("SEO", SEOSchema);

export default SEO;
