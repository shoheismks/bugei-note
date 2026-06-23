import { useEffect, useState } from "react";
import { Copy, QrCode, Search, Swords, UserPlus, Users } from "lucide-react";
import { supabase } from "../lib/supabase";

function Rivals() {
  const [myUserId, setMyUserId] = useState(null);
  const [myRanking, setMyRanking] = useState(null);
  const [rivals, setRivals] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showFullId, setShowFullId] = useState(false);

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

  const formatNumber = (value) => {
    const number = Number(value || 0);
    return Number.isFinite(number) ? number.toLocaleString("ja-JP") : "0";
  };

  const shortId = myUserId ? `${myUserId.slice(0, 8)}…` : "-";

  return (
    <main>
      <section className="card hero rivals-hero">
        <div className="rivals-hero-heading">
          <div>
            <p className="metric-label">RIVALS</p>
            <h2>武友と繋がる</h2>
          </div>
          <Users aria-hidden="true" size={24} />
        </div>

        <div className="rivals-count">{rivals.length}人</div>
        <h3>{rivals.length === 0 ? "武友がいません" : "武友と接続中"}</h3>
        <p className="hint">
          {rivals.length === 0
            ? "仲間を登録して競い合いましょう。"
            : "日々の鍛錬を比べながら、次の一歩を見つけましょう。"}
        </p>
      </section>

      <section className="card rivals-connect-card">
        <div className="rivals-section-heading">
          <QrCode aria-hidden="true" size={20} />
          <div>
            <p className="metric-label">CONNECT</p>
            <h2>ID交換</h2>
          </div>
        </div>
        <p className="hint">
          自分のIDを共有して、他の武芸者と繋がりましょう。
        </p>

        <div className="rival-id-row">
          <button
            className="rival-id-display"
            type="button"
            onClick={() => setShowFullId(!showFullId)}
          >
            <span>MY ID</span>
            <strong>{showFullId ? myUserId || "-" : shortId}</strong>
          </button>

          <button
            className="rival-icon-button"
            type="button"
            onClick={copyMyId}
            aria-label="ライバルIDをコピー"
          >
            <Copy aria-hidden="true" size={18} />
          </button>
        </div>

        {myUserId && (
          <div className="qr-box rival-qr-box">
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

      <section className="card rivals-add-card">
        <div className="rivals-section-heading">
          <UserPlus aria-hidden="true" size={20} />
          <div>
            <p className="metric-label">ADD RIVAL</p>
            <h2>ID検索</h2>
          </div>
        </div>
        <p className="hint">
          相手のIDを入力してライバル登録できます。
        </p>

        <input
          type="text"
          placeholder="ライバルIDを入力"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <button className="primary rivals-search-button" onClick={searchRival}>
          <Search aria-hidden="true" size={18} />
          検索
        </button>

        {searchResult && (
          <div className="rank-card rival-result-card">
            <div>
              <h3>{searchResult.dojo_name}</h3>
              <p>{searchResult.title || "SHU・HA・RI Member"}</p>
            </div>
            <strong>{formatNumber(searchResult.combat_power)} CP</strong>
            <button
              className="rival-outline-button"
              onClick={() => addRival(searchResult)}
            >
              ライバル登録
            </button>
          </div>
        )}
      </section>

      {rivals.length === 0 && (
        <section className="card rivals-empty-card">
          <Users aria-hidden="true" size={30} />
          <h2>まだライバルがいません</h2>
          <p className="hint">
            ランキング画面からライバル登録できます。
          </p>
        </section>
      )}

      {rivals.map((rival) => {
        const diff = getPowerDiff(rival);

        return (
          <section className="card rival-profile-card" key={rival.user_id}>
            <div className="rival-card-header">
              <div>
                <p className="metric-label">RIVAL</p>
                <h2>{rival.dojo_name}</h2>
                <p>{rival.title || "SHU・HA・RI Member"}</p>
              </div>
              <Swords aria-hidden="true" size={24} />
            </div>

            <div className="rival-card-stats">
              <div>
                <span>称号</span>
                <strong>{rival.title || "-"}</strong>
              </div>
              <div>
                <span>戦闘力</span>
                <strong>{formatNumber(rival.combat_power)}</strong>
              </div>
              <div>
                <span>最終ログイン</span>
                <strong>準備中</strong>
              </div>
              <div>
                <span>勝敗数</span>
                <strong>0 - 0</strong>
              </div>
            </div>

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

            <div className="rival-card-actions">
              <button className="rival-outline-button" type="button">
                比較
              </button>
              <button
                className="rival-outline-button"
                onClick={() => removeRival(rival.user_id)}
              >
                解除
              </button>
            </div>
          </section>
        );
      })}
    </main>
  );
}

export default Rivals;
