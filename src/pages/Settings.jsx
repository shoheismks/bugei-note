import { useState } from "react";
import { LogOut } from "lucide-react";
import { titles } from "../titles.js";
import SegmentedTabs from "../components/SegmentedTabs";

const settingsTabs = [
  { id: "profile", label: "プロフィール" },
  { id: "data", label: "データ管理" },
  { id: "account", label: "アカウント" },
];

function SettingsPage({
  profile,
  saveProfile,
  gender,
  saveGender,
  weightClass,
  selectedTitle,
  changeTitle,
  unlockedTitles,
  levelData,
  overallScore,
  combatPower,
  handleLogout,
}) {
  const [draft, setDraft] = useState(profile);
  const [settingsTab, setSettingsTab] = useState("profile");
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
    alert("設定を保存しました");
  };

  const level = levelData?.level || 1;
  const score = Number(overallScore || 0).toFixed(1);
  const power = combatPower?.total || 0;

  return (
    <main>
      <section className="card hero">
        <h2>設定</h2>
        <p className="beta-label">SHU・HA・RI β</p>
        <p className="hint">
          SHU・HA・RIのプロフィールとアカウントを管理します。
        </p>
      </section>

      <SegmentedTabs
        items={settingsTabs}
        value={settingsTab}
        onChange={setSettingsTab}
      />

      {settingsTab === "profile" && (
        <>
          <section className="card hero profile-master-card">
            <div className="big-rank">{selectedTitle || "現代サムライ"}</div>
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

            <h3>現在の称号</h3>
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

            <h3>館主名（ユーザー名）</h3>
            <input
              type="text"
              value={draft.dojo_name}
              onChange={(e) => update("dojo_name", e.target.value)}
              placeholder="例：山田太郎"
            />

            <h3>体重階級</h3>
            <p className="profile-readonly">{weightClass || "-"}</p>

            <h3>流派（将来用）</h3>
            <input
              type="text"
              value={draft.martial_style}
              onChange={(e) => update("martial_style", e.target.value)}
              placeholder="例：居合 / 剣術 / 柔術"
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
              設定を保存
            </button>
          </section>
        </>
      )}

      {settingsTab === "data" && (
        <section className="card settings-panel">
          <h3>データ管理（将来用）</h3>
          <p className="hint">
            エクスポート、復元、同期などの管理機能をここに集約予定です。
          </p>
        </section>
      )}

      {settingsTab === "account" && (
        <section className="card logout-card">
          <h3>アカウント</h3>
          <p className="hint">
            この端末からログアウトして、ログイン画面へ戻ります。
          </p>

          <button className="outline-action" onClick={handleLogout}>
            <LogOut aria-hidden="true" size={18} strokeWidth={2} />
            <span>ログアウト</span>
          </button>
        </section>
      )}
    </main>
  );
}

export default SettingsPage;
