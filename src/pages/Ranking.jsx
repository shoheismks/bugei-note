import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Ranking() {
  const [rankings, setRankings] = useState([]);
  const [myUserId, setMyUserId] = useState(null);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setMyUserId(user?.id || null);

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

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const myIndex = rankings.findIndex(
    (player) => player.user_id === myUserId
  );

  const myRanking = myIndex >= 0 ? rankings[myIndex] : null;
  const topRanking = rankings[0] || null;

  const powerGap =
    myRanking && topRanking
      ? Number(topRanking.combat_power || 0) -
        Number(myRanking.combat_power || 0)
      : 0;

  return (
    <main>
      <section className="card hero">
        <h2>🏆 武芸ランキング</h2>
        <p>全国の武芸者たち</p>

        <div className="big-rank">
          {myIndex >= 0 ? `${myIndex + 1}位` : "-"}
        </div>

        <p>
          あなたの順位：{myIndex >= 0 ? `${myIndex + 1}位` : "未登録"} /{" "}
          {rankings.length}人中
        </p>

        {myRanking && powerGap > 0 && (
          <p className="hint">
            1位との差：戦闘力 {powerGap}
          </p>
        )}

        {myRanking && powerGap === 0 && (
          <p className="hint">
            現在トップ。道場破り待ち。
          </p>
        )}
      </section>

      <section className="card">
        <h2>順位表</h2>

        {rankings.length === 0 && (
          <p>ランキングはまだありません</p>
        )}

        {rankings.map((player, index) => {
          const isMe = player.user_id === myUserId;

          return (
            <div
              key={player.user_id}
              className="rank-card"
              style={{
                border: isMe ? "1px solid #f2c14e" : "1px solid #333",
              }}
            >
              <h3>
                {getMedal(index)} {player.dojo_name}
                {isMe && "（あなた）"}
              </h3>

              <p>{player.title}</p>

              <p>戦闘力：{player.combat_power ?? 0}</p>

              <p>総XP：{player.total_xp ?? 0}</p>

              <p>
                総合スコア：
                {Number(player.overall_score ?? 0).toFixed(1)}
              </p>

              {index > 0 && (
                <p className="hint">
                  1位との差：
                  {Number(rankings[0]?.combat_power || 0) -
                    Number(player.combat_power || 0)}
                </p>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default Ranking;