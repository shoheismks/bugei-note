import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Rivals() {
  const [myUserId, setMyUserId] = useState(null);
  const [myRanking, setMyRanking] = useState(null);
  const [rivals, setRivals] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

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

  const normalizeRivalId = (value) => {
    return String(value || "")
      .trim()
      .replace(/^shuhari-rival:/i, "")
      .replace(/^https?:\/\/[^/]+\/rivals?\//i, "");
  };

  const addRival = async (rivalProfile) => {
    if (!myUserId || !rivalProfile?.user_id) return;
    if (myUserId === rivalProfile.user_id) {
      alert("自分自身はライバル登録できません");
      return;
    }
    if (rivals.some((rival) => rival.user_id === rivalProfile.user_id)) {
      alert("すでにライバル登録済みです");
      return;
    }

    const { error } = await supabase.from("rivals").insert({
      user_id: myUserId,
      rival_user_id: rivalProfile.user_id,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setRivals(
      [...rivals, rivalProfile].sort(
        (a, b) => Number(b.combat_power || 0) - Number(a.combat_power || 0)
      )
    );
    setSearchId("");
    setSearchResult(null);
  };

  const searchRival = async () => {
    const rivalId = normalizeRivalId(searchId);
    if (!rivalId) return;

    const { data, error } = await supabase
      .from("ranking_profiles")
      .select("*")
      .eq("user_id", rivalId)
      .maybeSingle();

    if (error) {
      alert(error.message);
      return;
    }

    if (!data) {
      alert("該当するIDが見つかりませんでした");
      setSearchResult(null);
      return;
    }

    setSearchResult(data);
  };

  const copyMyId = async () => {
    if (!myUserId) return;

    await navigator.clipboard.writeText(myUserId);
    alert("ライバルIDをコピーしました");
  };

  const getPowerDiff = (rival) => {
    return Number(rival.combat_power || 0) - Number(myRanking?.combat_power || 0);
  };

  return (
    <main>
      <section className="card hero">
        <h2>ライバル</h2>
        <p>登録した武芸者との比較</p>

        <div className="big-rank">{rivals.length}人</div>
      </section>

      <section className="card">
        <h2>ライバルID交換</h2>
        <p className="hint">自分のIDを共有して、相手のIDを検索できます。</p>

        <input value={myUserId || ""} readOnly />

        <button className="primary" onClick={copyMyId}>
          IDをコピー
        </button>

        {myUserId && (
          <div className="qr-box">
            <img
              alt="ライバルID QRコード"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                `shuhari-rival:${myUserId}`
              )}`}
            />
            <p className="hint">QRコードを相手に読み取ってもらってください。</p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>ID検索</h2>

        <input
          type="text"
          placeholder="ライバルIDを入力"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <button className="primary" onClick={searchRival}>
          検索
        </button>

        {searchResult && (
          <div className="rank-card">
            <h3>{searchResult.dojo_name}</h3>
            <p>{searchResult.title}</p>
            <p>戦闘力：{searchResult.combat_power ?? 0}</p>
            <button className="primary" onClick={() => addRival(searchResult)}>
              ライバル登録
            </button>
          </div>
        )}
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
