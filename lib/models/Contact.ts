import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  section: string;
  content: any;
}

const ContactSchema = new Schema<IContact>(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "heroSection",
        "contactStats",
        "contactFormHeader",
        "contactNextSteps",
        "contactMethods"
      ],
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

if (mongoose.models.Contact) {
  delete mongoose.models.Contact;
}

const Contact = mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
