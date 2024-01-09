import { NextResponse } from "next/server";

import { connectMongoDB } from "../../../lib/mongodb";
import Table from "../../../models/table";

export async function POST(req: Request) {
  let { data } = await req.json();
  await connectMongoDB();
  if (data) {
    const tableUpdated = await Table.findOneAndUpdate(
      { name: "Bitcoin" },
      { data }
    );
    if (tableUpdated)
      return NextResponse.json({ message: "table updated" }, { status: 201 });
    else {
      const tableCreated = await Table.create({ name: "Bitcoin", data });
      if (tableCreated)
        return NextResponse.json({ message: "table updated" }, { status: 201 });
    }
  }
  return NextResponse.json({ message: "table no updated" }, { status: 201 });
}
export async function GET(req: Request) {
  console.log("bitcoin");
  try {
    await connectMongoDB();

    const table = await Table.findOne({ name: "Bitcoin" });

    if (table) {
      return NextResponse.json(
        { message: "table updated", data: table.data },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "table not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
