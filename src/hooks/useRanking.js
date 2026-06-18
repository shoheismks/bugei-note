import { supabase } from "../lib/supabase";

export async function updateRanking({
  profile,
  combatPower,
  totalXp,
  overallScore,
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const payload = {
    user_id: user.id,
    dojo_name: profile?.dojo_name || "無名の武人",
    title: profile?.title || "現代サムライ",
    combat_power: Math.round(combatPower || 0),
    total_xp: Math.round(totalXp || 0),
    overall_score: Number(overallScore || 0),
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase
    .from("ranking_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("ranking_profiles")
      .update(payload)
      .eq("id", existing.id);

    return;
  }

  await supabase
    .from("ranking_profiles")
    .insert(payload);
}