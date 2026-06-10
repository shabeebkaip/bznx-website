import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Contact from "@/lib/models/Contact";

export async function GET() {
  try {
    await connectToDatabase();
    const allSections = await Contact.find();
    return NextResponse.json({ status: true, data: allSections }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { section: sectionName, content } = body;

    if (!sectionName || content === undefined) {
      return NextResponse.json({ status: false, message: "Section and content are required" }, { status: 400 });
    }

    const existing = await Contact.findOne({ section: sectionName });

    if (!existing) {
      // Create new section
      const newSection = await Contact.create({ section: sectionName, content });
      return NextResponse.json({ status: true, data: newSection }, { status: 201 });
    }

    // Always deep-merge content at top level (preserves sub-arrays when updating section fields)
    const existingContent = existing.content?.toObject ? existing.content.toObject() : existing.content;

    let mergedContent: any;

    if (Array.isArray(existingContent) && Array.isArray(content)) {
      // Both are arrays — full replace (used by ImageCardSection for logos)
      mergedContent = content;
    } else if (Array.isArray(existingContent) || Array.isArray(content)) {
      // Mismatch — just replace
      mergedContent = content;
    } else {
      // Both are objects — deep merge, preserving existing keys not in incoming content
      mergedContent = { ...existingContent, ...content };
    }

    const updatedSection = await Contact.findOneAndUpdate(
      { section: sectionName },
      { $set: { content: mergedContent } },
      { new: true }
    );

    return NextResponse.json({ status: true, data: updatedSection }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const sectionName = searchParams.get("section");
    const id = searchParams.get("id");
    const listKey = searchParams.get("listKey"); // For nested array deletion

    if (!sectionName || !id) {
      return NextResponse.json({ status: false, message: "Section and ID are required" }, { status: 400 });
    }

    const section = await Contact.findOne({ section: sectionName });
    if (!section) {
      return NextResponse.json({ status: false, message: "Section not found" }, { status: 404 });
    }

    const existingContent = section.content?.toObject ? section.content.toObject() : section.content;

    let updatedContent: any;

    if (Array.isArray(existingContent)) {
      // Content is a top-level array
      updatedContent = existingContent.filter((item: any) => item._id?.toString() !== id);
    } else if (listKey && typeof existingContent === "object") {
      // Content is an object with a nested array at listKey
      const subArray: any[] = existingContent[listKey] || [];
      const filteredSub = subArray.filter((item: any) => item._id?.toString() !== id);
      updatedContent = { ...existingContent, [listKey]: filteredSub };
    } else {
      return NextResponse.json({ status: false, message: "Cannot delete from non-array content without listKey" }, { status: 400 });
    }

    const updatedSection = await Contact.findOneAndUpdate(
      { section: sectionName },
      { $set: { content: updatedContent } },
      { new: true }
    );

    return NextResponse.json({ status: true, data: updatedSection }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}
