import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DB ERROR:", error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
