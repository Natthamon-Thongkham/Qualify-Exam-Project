import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Exam")
      .select("*")
      .limit(5);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Supabase connected successfully",
      data,
    });
  } catch (error) {
    console.error("Supabase connection error:", error);

    return NextResponse.json(
      {
        message: "Supabase connection failed",
      },
      { status: 500 }
    );
  }
}