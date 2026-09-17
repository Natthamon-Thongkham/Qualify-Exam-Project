import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        a.answer_id,
        a.question_id,
        q.question_text,
        a.final_score,
        q.max_score
      FROM answer a
      JOIN question q
        ON q.question_id = a.question_id
      ORDER BY a.answer_id ASC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error loading answers:", error);

    return NextResponse.json(
      { message: "Cannot load answers" },
      { status: 500 }
    );
  }
}