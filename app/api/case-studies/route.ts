import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import CaseStudy from "@/lib/models/CaseStudy";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const isValidId = id.match(/^[0-9a-fA-F]{24}$/);
      let caseStudy;
      
      if (isValidId) {
        caseStudy = await CaseStudy.findById(id);
      } else {
        // Fallback: try to find by the custom 'id' field if it's not a valid ObjectId
        caseStudy = await CaseStudy.findOne({ id: id });
      }

      if (!caseStudy) return NextResponse.json({ status: false, message: "Case Study not found" }, { status: 404 });
      return NextResponse.json({ status: true, data: caseStudy }, { status: 200 });
    }

    const caseStudies = await CaseStudy.find().sort({ createdAt: -1 });
    return NextResponse.json({ status: true, data: caseStudies }, { status: 200 });
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

    const caseStudy = await CaseStudy.create(body);
    return NextResponse.json({ status: true, data: caseStudy }, { status: 201 });
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

    const isValidId = id.match(/^[0-9a-fA-F]{24}$/);
    let caseStudy;
    
    if (isValidId) {
      caseStudy = await CaseStudy.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } else {
      caseStudy = await CaseStudy.findOneAndUpdate({ id: id }, updateData, { new: true, runValidators: true });
    }
    if (!caseStudy) return NextResponse.json({ status: false, message: "Case Study not found" }, { status: 404 });

    return NextResponse.json({ status: true, data: caseStudy }, { status: 200 });
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

    const isValidId = id.match(/^[0-9a-fA-F]{24}$/);
    let caseStudy;
    
    if (isValidId) {
      caseStudy = await CaseStudy.findByIdAndDelete(id);
    } else {
      caseStudy = await CaseStudy.findOneAndDelete({ id: id });
    }
    if (!caseStudy) return NextResponse.json({ status: false, message: "Case Study not found" }, { status: 404 });

    return NextResponse.json({ status: true, message: "Case Study deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}
