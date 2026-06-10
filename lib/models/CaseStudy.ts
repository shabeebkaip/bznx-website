import mongoose, { Schema, models, Document } from "mongoose";

const TranslatableString = {
  en: { type: String, default: "" },
  ar: { type: String, default: "" }
};

export interface ICaseStudy extends Document {
  title: { en: string; ar: string };
  slug: string;
  id: string;
  tag: { en: string; ar: string };
  industry: { en: string; ar: string };
  clientType: { en: string; ar: string };
  location: { en: string; ar: string };
  duration: { en: string; ar: string };
  image: any;
  outcome: { en: string; ar: string };
  description: { en: string; ar: string };
  
  challengeSection: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    content: { en: string; ar: string };
  };
  
  approachSection: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    items: Array<{
      title: { en: string; ar: string };
      description: { en: string; ar: string };
    }>;
  };
  
  resultsSection: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    items: Array<{
      value: { en: string; ar: string };
      label: { en: string; ar: string };
    }>;
  };
  
  deliverablesSection: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    items: Array<{ en: string; ar: string }>;
  };

  services: Array<{ en: string; ar: string }>;
  
  testimonial?: {
    quote: { en: string; ar: string };
    author: { en: string; ar: string };
    role: { en: string; ar: string };
  };

  cta?: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    ctaText: { en: string; ar: string };
    ctaLink: string;
    ctaText2: { en: string; ar: string };
    ctaLink2: string;
  };

  relatedSection?: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
  };
}

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    title: TranslatableString,
    slug: { type: String, required: true, unique: true },
    id: { type: String },
    tag: TranslatableString,
    industry: TranslatableString,
    clientType: TranslatableString,
    location: TranslatableString,
    duration: TranslatableString,
    image: { type: Schema.Types.Mixed },
    outcome: TranslatableString,
    description: TranslatableString,
    
    challengeSection: {
      badge: TranslatableString,
      title: TranslatableString,
      content: TranslatableString
    },
    
    approachSection: {
      badge: TranslatableString,
      title: TranslatableString,
      items: [{
        title: TranslatableString,
        description: TranslatableString
      }]
    },
    
    resultsSection: {
      badge: TranslatableString,
      title: TranslatableString,
      items: [{
        value: TranslatableString,
        label: TranslatableString
      }]
    },
    
    deliverablesSection: {
      badge: TranslatableString,
      title: TranslatableString,
      items: [TranslatableString]
    },
    
    services: [TranslatableString],
    
    testimonial: {
      quote: TranslatableString,
      author: TranslatableString,
      role: TranslatableString
    },

    cta: {
      title: TranslatableString,
      description: TranslatableString,
      ctaText: TranslatableString,
      ctaLink: { type: String, default: "" },
      ctaText2: TranslatableString,
      ctaLink2: { type: String, default: "" }
    },

    relatedSection: {
      badge: TranslatableString,
      title: TranslatableString
    }
  },
  { timestamps: true }
);

if (mongoose.models.CaseStudy) {
  delete mongoose.models.CaseStudy;
}

const CaseStudy = mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);

export default CaseStudy;
