import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Blog from "@/lib/models/Blog";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");
    const featured = searchParams.get("featured");

    if (id) {
      const blog = await Blog.findById(id);
      if (!blog) {
        return NextResponse.json({ status: false, message: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json({ status: true, data: blog }, { status: 200 });
    }

    if (slug) {
      const blog = await Blog.findOne({ slug });
      if (!blog) {
        return NextResponse.json({ status: false, message: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json({ status: true, data: blog }, { status: 200 });
    }

    const query: any = {};
    if (featured === "true") query.featured = true;

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ status: true, data: blogs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();


    if (body.title?.en) {
      body.slug = slugify(body.title.en);
    }

    if (body.featured) {
      if (body._id) {
        await Blog.updateMany({ _id: { $ne: body._id } }, { featured: false });
      } else {
        await Blog.updateMany({}, { featured: false });
      }
    }

    // If it has an ID, it's an update
    if (body._id) {
      const updated = await Blog.findByIdAndUpdate(body._id, body, { new: true });
      return NextResponse.json({ status: true, data: updated }, { status: 200 });
    }

    // Otherwise create new
    const newBlog = await Blog.create(body);
    return NextResponse.json({ status: true, data: newBlog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ status: false, message: "ID is required" }, { status: 400 });
    }

    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ status: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}
