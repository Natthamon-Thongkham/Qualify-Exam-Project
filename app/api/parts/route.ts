import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Exam_Parts")
      .select("Part_id, Exam_id, Part_number, Title, Instruction, Total_score")
      .eq("Exam_id", 11)
      .order("Part_number", { ascending: true });

    if (error) {
      console.error("Error loading exam parts:", error);

      return NextResponse.json(
        { message: "Cannot load exam parts" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);

    return NextResponse.json(
      { message: "Cannot load exam parts" },
      { status: 500 }
    );
  }
}