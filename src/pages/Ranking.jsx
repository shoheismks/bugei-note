import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Ranking() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    const { data, error } = await supabase
      .from("ranking_profiles")
      .select("*")
      .order("combat_power", { ascending: false });

    if (error) {
      console.log(error.message);
      return;
    }

    setRankings(data || []);
  };

  return (
    <main>
      <section className="card hero">
        <h2>🏆 武芸ランキング</h2>
        <p>全国の武芸者たち</p>
      </section>

      <section className="card">
        {rankings.map((player, index) => (
          <div
            key={player.user_id}
            className="rank-card"
          >
            <h3>
              #{index + 1} {player.dojo_name}
            </h3>

            <p>{player.title}</p>

            <p>戦闘力：{player.combat_power ?? 0}</p>

            <p>総XP：{player.total_xp ?? 0}</p>

            <p>総合段位：{player.overall_score ?? 0}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Ranking;