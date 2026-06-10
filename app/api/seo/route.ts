import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import SEO from "@/lib/models/SEO";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const page = searchParams.get("page");

    if (id) {
      const seo = await SEO.findById(id);
      if (!seo) return NextResponse.json({ status: false, message: "SEO not found" }, { status: 404 });
      return NextResponse.json({ status: true, data: seo }, { status: 200 });
    }

    if (page) {
      const seo = await SEO.findOne({ page });
      if (!seo) return NextResponse.json({ status: false, message: "SEO not found" }, { status: 404 });
      return NextResponse.json({ status: true, data: seo }, { status: 200 });
    }

    const seos = await SEO.find().sort({ createdAt: -1 });
    return NextResponse.json({ status: true, data: seos }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    if (body.page) {
      body.page = body.page.toLowerCase().trim();
    }

    const seo = await SEO.create(body);
    return NextResponse.json({ status: true, data: seo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ status: false, message: "ID is required" }, { status: 400 });

    if (updateData.page) {
      updateData.page = updateData.page.toLowerCase().trim();
    }

    const seo = await SEO.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!seo) return NextResponse.json({ status: false, message: "SEO not found" }, { status: 404 });

    return NextResponse.json({ status: true, data: seo }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ status: false, message: "ID is required" }, { status: 400 });

    const seo = await SEO.findByIdAndDelete(id);
    if (!seo) return NextResponse.json({ status: false, message: "SEO not found" }, { status: 404 });

    return NextResponse.json({ status: true, message: "SEO deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}
