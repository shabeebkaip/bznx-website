import mongoose, { Schema, Document } from "mongoose";

const TranslatableString = {
  en: { type: String, default: "" },
  ar: { type: String, default: "" }
};

export interface IBlog extends Document {
  title: { en: string; ar: string };
  slug: string;
  category: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  date: string;
  readTime: { en: string; ar: string };
  featured: boolean;
  image: any;
  author: { en: string; ar: string };
  
  contentSection: {
    content: any[];
  };
  
  ctaSection?: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    ctaText: { en: string; ar: string };
    ctaLink: string;
    ctaText2?: { en: string; ar: string };
    ctaLink2?: string;
  };
}

const BlogSchema = new Schema<IBlog>(
  {
    title: TranslatableString,
    slug: { type: String, required: true, unique: true },
    category: TranslatableString,
    excerpt: TranslatableString,
    date: { type: String, default: "" },
    readTime: TranslatableString,
    featured: { type: Boolean, default: false },
    image: { type: Schema.Types.Mixed },
    author: TranslatableString,

    contentSection: {
      content: { type: [Schema.Types.Mixed], default: [] }
    },

    ctaSection: {
      badge: TranslatableString,
      title: TranslatableString,
      description: TranslatableString,
      ctaText: TranslatableString,
      ctaLink: { type: String, default: "" },
      ctaText2: TranslatableString,
      ctaLink2: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

const Blog = mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
