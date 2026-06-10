import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const oldPublicId = formData.get("public_id") as string;
    const oldResourceType = (formData.get("resource_type") as string) || "image";

    if (!file) {
      return NextResponse.json({ status: false, message: "No file uploaded" }, { status: 400 });
    }

    // Determine resource type
    const mimeType = file.type;
    let resourceType: "image" | "video" | "raw" = "image";

    if (mimeType.startsWith("image/")) {
      resourceType = "image";
    } else if (mimeType.startsWith("video/") || mimeType.startsWith("audio/")) {
      resourceType = "video";
    } else {
      resourceType = "raw";
    }

    // Delete old file if publicId provided
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId, {
          resource_type: oldResourceType,
        });
      } catch (e) {
        console.error("Old file delete failed:", e);
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using a promise-based approach
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "BZNX",
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    const downloadUrl = result.secure_url.replace(
      "/upload/",
      `/upload/fl_attachment:${file.name}/`
    );

    return NextResponse.json({
      status: true,
      message: "File uploaded successfully to Cloudinary",
      url: result.secure_url, // For backward compatibility with existing components
      fileUrl: result.secure_url,
      downloadUrl,
      public_id: result.public_id,
      resource_type: resourceType,
      name: file.name,
    });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ status: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { public_id, resource_type = "image" } = body;

    if (!public_id) {
      return NextResponse.json({ status: false, message: "Public ID is required" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id, {
        resource_type
    });

    if (result.result === "ok") {
      return NextResponse.json({ status: true, message: "Image deleted successfully" });
    } else {
      return NextResponse.json({ status: false, message: "Failed to delete image" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Cloudinary Deletion Error:", error);
    return NextResponse.json({ status: false, message: "Failed to delete image" }, { status: 500 });
  }
}
