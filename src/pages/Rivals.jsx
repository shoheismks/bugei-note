import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Rivals() {
  const [myUserId, setMyUserId] = useState(null);
  const [myRanking, setMyRanking] = useState(null);
  const [rivals, setRivals] = useState([]);

  useEffect(() => {
    loadRivals();
  }, []);

  const loadRivals = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setMyUserId(user.id);

    const { data: myData } = await supabase
      .from("ranking_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    setMyRanking(myData || null);

    const { data: rivalLinks, error: rivalError } = await supabase
      .from("rivals")
      .select("rival_user_id")
      .eq("user_id", user.id);

    if (rivalError) {
      console.log(rivalError.message);
      return;
    }

    const rivalIds = (rivalLinks || []).map((item) => item.rival_user_id);

    if (rivalIds.length === 0) {
      setRivals([]);
      return;
    }

    const { data: rivalProfiles, error: profileError } = await supabase
      .from("ranking_profiles")
      .select("*")
      .in("user_id", rivalIds)
      .order("combat_power", { ascending: false });

    if (profileError) {
      console.log(profileError.message);
      return;
    }

    setRivals(rivalProfiles || []);
  };

  const removeRival = async (rivalUserId) => {
    if (!myUserId) return;

    const { error } = await supabase
      .from("rivals")
      .delete()
      .eq("user_id", myUserId)
      .eq("rival_user_id", rivalUserId);

    if (error) {
      alert(error.message);
      return;
    }

    setRivals(rivals.filter((rival) => rival.user_id !== rivalUserId));
  };

  const getPowerDiff = (rival) => {
    return Number(rival.combat_power || 0) - Number(myRanking?.combat_power || 0);
  };

  return (
    <main>
      <section className="card hero">
        <h2>⚔️ ライバル</h2>
        <p>登録した武芸者との比較</p>

        <div className="big-rank">{rivals.length}人</div>
      </section>

      {rivals.length === 0 && (
        <section className="card">
          <p>ライバルはまだいません</p>
          <p className="hint">
            ランキング画面からライバル登録できます。
          </p>
        </section>
      )}

      {rivals.map((rival) => {
        const diff = getPowerDiff(rival);

        return (
          <section className="card" key={rival.user_id}>
            <h2>{rival.dojo_name}</h2>

            <p>{rival.title}</p>

            <p>戦闘力：{rival.combat_power ?? 0}</p>
            <p>総XP：{rival.total_xp ?? 0}</p>
            <p>
              総合スコア：
              {Number(rival.overall_score ?? 0).toFixed(1)}
            </p>

            {myRanking && (
              <p className="hint">
                あなたとの差：
                {diff > 0
                  ? `+${diff} 相手が上`
                  : diff < 0
                  ? `${Math.abs(diff)} あなたが上`
                  : "互角"}
              </p>
            )}

            <button
              className="danger"
              onClick={() => removeRival(rival.user_id)}
            >
              ライバル解除
            </button>
          </section>
        );
      })}
    </main>
  );
}

export default Rivals;