import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  section: string;
  content: any;
}

const AboutSchema = new Schema<IAbout>(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "heroSection",
        "aboutSection",
        "aboutStats",
        "aboutMission",
        "aboutVision",
        "aboutValuesHeader",
        "aboutValues",
        "aboutTeamHeader",
        "aboutTeam",
        "aboutClientsHeader",
        "aboutClients",
        "aboutCta"
      ],
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

if (mongoose.models.About) {
  delete mongoose.models.About;
}

const About = mongoose.model<IAbout>("About", AboutSchema);

export default About;
