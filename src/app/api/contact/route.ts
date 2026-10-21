import { NextResponse } from "next/server";
import { apiPost, ApiError } from "@/lib/api/client";
import type { VisitorMessage } from "@/lib/api/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VisitorMessage;
    const created = await apiPost<{ detail?: string }>("/api/contact/", body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not send the message." }, { status: 500 });
  }
}
