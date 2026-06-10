import mongoose, { Schema, models, Document } from "mongoose";

const TranslatableString = {
  en: { type: String, default: "" },
  ar: { type: String, default: "" }
};

export interface IService extends Document {
  title: { en: string; ar: string };
  slug: string;
  tag: { en: string; ar: string };
  icon: any; 
  description: { en: string; ar: string };
  bullets: Array<{ en: string; ar: string }>;
  fullDescription: { en: string; ar: string };
  timeline: { en: string; ar: string };
  
  featuresSection: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    items: Array<{ title: { en: string; ar: string }; description: { en: string; ar: string } }>;
  };
  
  processSection: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    items: Array<{ number: string; title: { en: string; ar: string }; description: { en: string; ar: string } }>;
  };
  
  deliverablesSection: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    items: Array<{ en: string; ar: string }>;
  };
  
  differenceSection: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    items: Array<{ title: { en: string; ar: string }; description: { en: string; ar: string } }>;
  };

  otherServicesSection: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
  };
}

const ServiceSchema = new Schema<IService>(
  {
    title: TranslatableString,
    slug: { type: String, required: true, unique: true },
    tag: TranslatableString,
    icon: { type: Schema.Types.Mixed },
    description: TranslatableString,
    bullets: [TranslatableString],
    fullDescription: TranslatableString,
    timeline: TranslatableString,
    
    featuresSection: {
      badge: TranslatableString,
      title: TranslatableString,
      items: [{ type: Schema.Types.Mixed }]
    },
    
    processSection: {
      badge: TranslatableString,
      title: TranslatableString,
      items: [{ type: Schema.Types.Mixed }]
    },
    
    deliverablesSection: {
      badge: TranslatableString,
      title: TranslatableString,
      items: [TranslatableString]
    },
    
    differenceSection: {
      badge: TranslatableString,
      title: TranslatableString,
      items: [{ type: Schema.Types.Mixed }]
    },

    otherServicesSection: {
      badge: TranslatableString,
      title: TranslatableString
    }
  },
  { timestamps: true }
);

if (mongoose.models.Service) {
  delete mongoose.models.Service;
}

const Service = mongoose.model<IService>("Service", ServiceSchema);

export default Service;
