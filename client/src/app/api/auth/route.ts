import { NextResponse, NextRequest } from "next/server";

const handler = async (req: NextRequest) => {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  return NextResponse.json({ hello: "world" });
};

export { handler as GET };
