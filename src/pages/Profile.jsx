import { useState } from "react";
import { titles } from "../titles.js";

function Profile({
  profile,
  saveProfile,
  gender,
  saveGender,
  weightClass,
  selectedTitle,
  changeTitle,
  unlockedTitles,
  handleLogout,
}) {
  const [draft, setDraft] = useState(profile);
  const safeUnlockedTitles = unlockedTitles || ["現代サムライ"];
  const selectableTitles = titles.filter((title) =>
    safeUnlockedTitles.includes(title.name)
  );

  const update = (key, value) => {
    setDraft({
      ...draft,
      [key]: value,
    });
  };

  const handleSave = async () => {
    await saveProfile({
      ...draft,
      title: selectedTitle || draft.title,
    });
    alert("プロフィールを保存しました");
  };

  return (
    <main>
      <section className="card hero">
        <h2>プロフィール</h2>
        <p className="hint">
          ランキング・仲間機能で表示される情報です。
        </p>
      </section>

      <section className="card profile-settings-card">
        <h3>性別</h3>
        <select value={gender} onChange={(e) => saveGender(e.target.value)}>
          <option value="male">男性</option>
          <option value="female">女性</option>
        </select>

        <h3>体重階級</h3>
        <p className="profile-readonly">{weightClass || "-"}</p>

        <h3>称号</h3>
        <select
          value={selectedTitle}
          onChange={(e) => {
            changeTitle(e.target.value);
            update("title", e.target.value);
          }}
        >
          {selectableTitles.map((title) => (
            <option key={title.id} value={title.name}>
              {title.name}
            </option>
          ))}
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

      <section className="card logout-card">
        <h3>アカウント</h3>
        <p className="hint">
          この端末からログアウトして、ログイン画面へ戻ります。
        </p>

        <button className="danger" onClick={handleLogout}>
          ログアウト
        </button>
      </section>
    </main>
  );
}

export default Profile;
