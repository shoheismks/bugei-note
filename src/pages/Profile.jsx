import { useState } from "react";

function Profile({
  profile,
  saveProfile,
  gender = "male",
  saveGender = () => {},
  selectedTitle,
  levelData,
  overallScore,
  combatPower,
}) {
  const [draft, setDraft] = useState(profile);

  const update = (key, value) => {
    setDraft({
      ...draft,
      [key]: value,
    });
  };

  const handleSave = async () => {
    await saveProfile(draft);
    alert("プロフィールを保存しました");
  };

  const level = levelData?.level || 1;
  const score = Number(overallScore || 0).toFixed(1);
  const power = combatPower?.total || 0;

  return (
    <main>
      <section className="card hero profile-master-card">
        <div className="big-rank">{selectedTitle || draft.title || "現代サムライ"}</div>
        <h2>{draft.dojo_name || "下越翔平"}</h2>
        <p className="profile-kicker">SHU・HA・RI Member</p>

        <div className="profile-stat-grid">
          <div>
            <span>Lv</span>
            <strong>{level}</strong>
          </div>
          <div>
            <span>段位</span>
            <strong>{score}</strong>
          </div>
          <div>
            <span>武指数</span>
            <strong>{power}</strong>
          </div>
        </div>
      </section>

      <section className="card profile-settings-card">
        <h3>性別</h3>
        <select value={gender} onChange={(e) => saveGender(e.target.value)}>
          <option value="male">男性</option>
          <option value="female">女性</option>
        </select>

        <h3>館主名</h3>
        <input
          type="text"
          value={draft.dojo_name}
          onChange={(e) => update("dojo_name", e.target.value)}
          placeholder="例：山田太郎"
        />

        <h3>流派（将来用）</h3>
        <input
          type="text"
          value={draft.martial_style}
          onChange={(e) => update("martial_style", e.target.value)}
          placeholder="例：古武術 / 居合 / 剣術"
        />

        <h3>自己紹介（将来用）</h3>
        <textarea
          value={draft.bio}
          onChange={(e) => update("bio", e.target.value)}
          placeholder="稽古で大切にしていること、今伸ばしたい力、日々の目標など"
        />

        <details className="dev-field">
          <summary>開発用</summary>
          <h3>画像URL</h3>
          <input
            type="text"
            value={draft.avatar_url}
            onChange={(e) => update("avatar_url", e.target.value)}
            placeholder="画像URL"
          />
        </details>

        <button className="primary" onClick={handleSave}>
          プロフィールを保存
        </button>
      </section>
    </main>
  );
}

export default Profile;
