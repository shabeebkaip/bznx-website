import mongoose, { Schema, models, Document } from "mongoose";

export interface IHome extends Document {
  section: string;
  content: any;
}

const HomeSchema = new Schema<IHome>(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "hero",
        "heroStats",
        "heroBadges",
        "heroCards",
        "aboutMain",
        "aboutFeatures",
        "aboutStats",
        "trustedBy",
        "services",
        "whySaudi",
        "opportunity",
        "howWeWork",
        "benefits",
        "caseStudies",
        "testimonials",
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

if (mongoose.models.Home) {
  delete mongoose.models.Home;
}

const Home = mongoose.model<IHome>("Home", HomeSchema);

export default Home;
