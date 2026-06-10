import mongoose, { Schema, models, Document } from "mongoose";

export interface IServiceCMS extends Document {
  section: string;
  content: any;
}

const ServiceCMSSchema = new Schema<IServiceCMS>(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "hero",
        "servicesHeading",
        "businessSetup",
        "timelines",
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

if (mongoose.models.ServiceCMS) {
  delete mongoose.models.ServiceCMS;
}

const ServiceCMS = mongoose.model<IServiceCMS>("ServiceCMS", ServiceCMSSchema);

export default ServiceCMS;
