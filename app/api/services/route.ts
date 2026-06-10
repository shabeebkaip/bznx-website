import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Service from "@/lib/models/Service";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const service = await Service.findById(id);
      if (!service) return NextResponse.json({ status: false, message: "Service not found" }, { status: 404 });
      return NextResponse.json({ status: true, data: service }, { status: 200 });
    }

    const services = await Service.find().sort({ createdAt: -1 });
    return NextResponse.json({ status: true, data: services }, { status: 200 });
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

    const service = await Service.create(body);
    return NextResponse.json({ status: true, data: service }, { status: 201 });
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

    if (updateData.title?.en) {
      updateData.slug = slugify(updateData.title.en);
    }

    const service = await Service.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!service) return NextResponse.json({ status: false, message: "Service not found" }, { status: 404 });

    return NextResponse.json({ status: true, data: service }, { status: 200 });
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

    const service = await Service.findByIdAndDelete(id);
    if (!service) return NextResponse.json({ status: false, message: "Service not found" }, { status: 404 });

    return NextResponse.json({ status: true, message: "Service deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}
