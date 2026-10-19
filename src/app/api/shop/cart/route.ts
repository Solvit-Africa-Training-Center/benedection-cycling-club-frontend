import { NextResponse } from "next/server";
import { apiPost, ApiError } from "@/lib/api/client";
import type { CartRequestWrite } from "@/lib/api/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CartRequestWrite;
    if (!body.customer_phone?.trim()) delete body.customer_phone;
    const created = await apiPost<CartRequestWrite>("/api/shop/cart/", body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Could not submit the cart request." }, { status: 500 });
  }
}
