import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "No Authorization header" }), { status: 401 });
    const token = authHeader.replace("Bearer ", "");

    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { user_id, champion_id, checked } = await req.json();
    if (!user_id || !champion_id) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }

    if (checked) {
      const { error } = await supabaseServer
        .from("progression")
        .insert({ user_id, champion_id });
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    } else {
      const { error } = await supabaseServer
        .from("progression")
        .delete()
        .eq("user_id", user_id)
        .eq("champion_id", champion_id);
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
