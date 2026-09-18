import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Question")
      .select(`
        Question_id,
        Part_id,
        Question_text,
        Max_score
      `)
      .order("Question_id", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error loading questions:", error);

    return NextResponse.json(
      { message: "Cannot load questions" },
      { status: 500 }
    );
  }
}