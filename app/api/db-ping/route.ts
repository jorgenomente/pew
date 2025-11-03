import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET() {
  const client = new Client({ connectionString: process.env.DATABASE_URL! });
  try {
    await client.connect();
    const r = await client.query("select now()");
    return NextResponse.json({ ok: true, now: r.rows[0].now });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  } finally {
    await client.end();
  }
}
