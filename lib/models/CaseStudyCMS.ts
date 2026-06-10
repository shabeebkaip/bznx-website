import mongoose, { Schema, models, Document } from "mongoose";

export interface ICaseStudyCMS extends Document {
  section: string;
  content: any;
}

const CaseStudyCMSSchema = new Schema<ICaseStudyCMS>(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "hero",
        "cta",
      ],
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

if (mongoose.models.CaseStudyCMS) {
  delete mongoose.models.CaseStudyCMS;
}

const CaseStudyCMS = mongoose.model<ICaseStudyCMS>("CaseStudyCMS", CaseStudyCMSSchema);

export default CaseStudyCMS;
