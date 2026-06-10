import mongoose, { Schema, Document } from "mongoose";

export interface IFooter extends Document {
  section: string;
  content: any;
}

const FooterSchema = new Schema<IFooter>(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "footerMain",
        "footerStats",
        "footerSocials",
        "footerNavigate",
        "footerServices"
      ],
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

if (mongoose.models.Footer) {
  delete mongoose.models.Footer;
}

const Footer = mongoose.model<IFooter>("Footer", FooterSchema);

export default Footer;
