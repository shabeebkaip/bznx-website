import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Enquiry from "@/lib/models/Enquiry";
import { sendEnquiryEmail } from "@/lib/mail";

// GET: Fetch all enquiries (for admin)
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Simple check if it's an admin request (in a real app, verify JWT)
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true"; 

    if (!isAdmin) {
        return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }

    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ status: true, data: enquiries }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

// POST: Submit new enquiry
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json({ status: false, message: "All fields are required" }, { status: 400 });
    }

    const newEnquiry = await Enquiry.create({
      name,
      email,
      phone,
      service,
      message
    });

    // Send Email Notification
    await sendEnquiryEmail({ name, email, phone, service, message });

    return NextResponse.json({ status: true, data: newEnquiry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove enquiry (for admin)
export async function DELETE(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ status: false, message: "ID is required" }, { status: 400 });
        }

        await Enquiry.findByIdAndDelete(id);
        return NextResponse.json({ status: true, message: "Deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ status: false, error: error.message }, { status: 500 });
    }
}
