import { NextRequest, NextResponse } from "next/server";

export async function GET(request) {
  const greeting = "Hello World!!";
  const json = {
    greeting,
  };

  return NextResponse.json(json);
}
