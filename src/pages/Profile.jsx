import { useState } from "react";

function Profile({ profile, saveProfile }) {
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

  return (
    <main>
      <section className="card hero">
        <h2>館主プロフィール</h2>
        <p className="hint">
          ランキング・仲間機能で表示される情報です。
        </p>
      </section>

      <section className="card">
        <h3>館主名</h3>
        <input
          type="text"
          value={draft.dojo_name}
          onChange={(e) => update("dojo_name", e.target.value)}
          placeholder="例：下越翔平"
        />

        <h3>称号</h3>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="例：現代サムライ"
        />

        <h3>流派・所属</h3>
        <input
          type="text"
          value={draft.martial_style}
          onChange={(e) => update("martial_style", e.target.value)}
          placeholder="例：古武術 / 居合 / 剣術"
        />

        <h3>自己紹介</h3>
        <textarea
          value={draft.bio}
          onChange={(e) => update("bio", e.target.value)}
          placeholder="稽古歴・得意技・目標など"
        />

        <h3>画像URL</h3>
        <input
          type="text"
          value={draft.avatar_url}
          onChange={(e) => update("avatar_url", e.target.value)}
          placeholder="画像URL"
        />

        <button className="primary" onClick={handleSave}>
          プロフィールを保存
        </button>
      </section>
    </main>
  );
}

export default Profile;