import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import BlogCMS from "@/lib/models/BlogCMS";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section) {
      const content = await BlogCMS.findOne({ section });
      return NextResponse.json({ status: true, data: content }, { status: 200 });
    }

    const allContent = await BlogCMS.find();
    return NextResponse.json({ status: true, data: allContent }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { section, content } = body;

    if (!section || !content) {
      return NextResponse.json({ status: false, message: "Section and content are required" }, { status: 400 });
    }

    const updated = await BlogCMS.findOneAndUpdate(
      { section },
      { content },
      { upsert: true, new: true }
    );

    return NextResponse.json({ status: true, data: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}
