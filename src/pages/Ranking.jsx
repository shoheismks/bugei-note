import { useEffect, useState } from "react";
import { Swords, Trophy, Users } from "lucide-react";
import { supabase } from "../lib/supabase";

function Ranking() {
  const [rankings, setRankings] = useState([]);
  const [myUserId, setMyUserId] = useState(null);
  const [rivalIds, setRivalIds] = useState([]);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const currentUserId = user?.id || null;
    setMyUserId(currentUserId);

    const { data, error } = await supabase
      .from("ranking_profiles")
      .select("*")
      .order("combat_power", { ascending: false });

    if (error) {
      console.log(error.message);
      return;
    }

    setRankings(data || []);

    if (!currentUserId) return;

    const { data: rivalsData, error: rivalsError } = await supabase
      .from("rivals")
      .select("rival_user_id")
      .eq("user_id", currentUserId);

    if (rivalsError) {
      console.log(rivalsError.message);
      return;
    }

    setRivalIds(
      (rivalsData || []).map((item) => item.rival_user_id)
    );
  };

  const addRival = async (rivalUserId) => {
    if (!myUserId) return;
    if (myUserId === rivalUserId) return;
    if (rivalIds.includes(rivalUserId)) return;

    const { error } = await supabase.from("rivals").insert({
      user_id: myUserId,
      rival_user_id: rivalUserId,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setRivalIds([...rivalIds, rivalUserId]);
    alert("ライバルに登録しました");
  };

  const removeRival = async (rivalUserId) => {
    if (!myUserId) return;
    if (!rivalIds.includes(rivalUserId)) return;
    const result = window.confirm(
      "本当に削除しますか？\nこの操作は戻せません。"
    );
    if (!result) return;

    const { error } = await supabase
      .from("rivals")
      .delete()
      .eq("user_id", myUserId)
      .eq("rival_user_id", rivalUserId);

    if (error) {
      alert(error.message);
      return;
    }

    setRivalIds(rivalIds.filter((id) => id !== rivalUserId));
    alert("ライバル登録を解除しました");
  };

  const getRankLabel = (index) => {
    if (index < 3) return `0${index + 1}`;
    return `#${index + 1}`;
  };

  const formatNumber = (value) => {
    const number = Number(value || 0);
    return Number.isFinite(number) ? number.toLocaleString("ja-JP") : "0";
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
  const hasFewPlayers = rankings.length > 0 && rankings.length < 5;

  return (
    <main>
      <section className="card hero ranking-hero">
        <div className="ranking-hero-heading">
          <div>
            <p className="metric-label">RIVAL BOARD</p>
            <h2>武芸ランキング</h2>
          </div>
          <Users aria-hidden="true" size={24} />
        </div>

        <div className="ranking-place">
          <span>あなたの順位</span>
          <strong>{myIndex >= 0 ? `${myIndex + 1}位` : "-"}</strong>
        </div>

        <div className="ranking-hero-stats">
          <div>
            <span>総参加人数</span>
            <strong>{rankings.length}人</strong>
          </div>
          <div>
            <span>1位との差</span>
            <strong>{myRanking ? formatNumber(powerGap) : "-"}</strong>
          </div>
          <div>
            <span>戦闘力</span>
            <strong>{formatNumber(myRanking?.combat_power)}</strong>
          </div>
        </div>

        {myRanking && powerGap > 0 && (
          <p className="hint">
            トップとの差は戦闘力 {formatNumber(powerGap)}。次の記録で詰めていきましょう。
          </p>
        )}

        {myRanking && powerGap === 0 && (
          <p className="hint">現在トップ。次はライバルとの差を広げるフェーズです。</p>
        )}

        {hasFewPlayers && (
          <p className="hint">
            参加者が増えるほど比較が楽しくなります。最初のライバルを登録してボードを育てましょう。
          </p>
        )}
      </section>

      <section className="card ranking-board-card">
        <div className="ranking-board-heading">
          <div>
            <p className="metric-label">LEADERBOARD</p>
            <h2>ライバルボード</h2>
          </div>
          <Trophy aria-hidden="true" size={22} />
        </div>

        {rankings.length === 0 && (
          <div className="ranking-empty">
            <Swords aria-hidden="true" size={28} />
            <h3>ランキングはまだありません</h3>
            <p>記録を積み上げると、ここにライバルボードが表示されます。</p>
          </div>
        )}

        {rankings.map((player, index) => {
          const isMe = player.user_id === myUserId;
          const isRival = rivalIds.includes(player.user_id);
          const playerGap =
            index > 0
              ? Number(rankings[0]?.combat_power || 0) -
                Number(player.combat_power || 0)
              : 0;

          return (
            <div
              key={player.user_id}
              className={`rank-card ranking-player-card ${
                index < 3 ? "podium-card" : ""
              } ${isMe ? "is-me" : ""}`}
            >
              <div className="ranking-player-main">
                <div className="ranking-medal">
                  {index < 3 && <Trophy aria-hidden="true" size={17} />}
                  <span>{getRankLabel(index)}</span>
                </div>

                <div>
                  <h3>
                    {player.dojo_name}
                    {isMe && <span className="self-badge">あなた</span>}
                  </h3>
                  <p>{player.title || "SHU・HA・RI Member"}</p>
                </div>
              </div>

              <div className="ranking-stat-grid">
                <div>
                  <span>戦闘力</span>
                  <strong>{formatNumber(player.combat_power)}</strong>
                </div>
                <div>
                  <span>総XP</span>
                  <strong>{formatNumber(player.total_xp)}</strong>
                </div>
                <div>
                  <span>総合スコア</span>
                  <strong>{Number(player.overall_score ?? 0).toFixed(1)}</strong>
                </div>
                <div>
                  <span>1位との差</span>
                  <strong>{index > 0 ? formatNumber(playerGap) : "TOP"}</strong>
                </div>
              </div>

              {!isMe && (
                <button
                  className="rival-outline-button"
                  onClick={() =>
                    isRival
                      ? removeRival(player.user_id)
                      : addRival(player.user_id)
                  }
                >
                  {isRival ? "登録済み" : "ライバル登録"}
                </button>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default Ranking;
