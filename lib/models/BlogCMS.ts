import mongoose, { Schema, Document } from "mongoose";

export interface IBlogCMS extends Document {
  section: string;
  content: any;
}

const BlogCMSSchema = new Schema<IBlogCMS>(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "hero",
        "listHeader",
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

if (mongoose.models.BlogCMS) {
  delete mongoose.models.BlogCMS;
}

const BlogCMS = mongoose.model<IBlogCMS>("BlogCMS", BlogCMSSchema);

export default BlogCMS;
