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
        <section className="card profile-settings-card">
          <h3>性別</h3>
          <select value={gender} onChange={(e) => saveGender(e.target.value)}>
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>

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

          <h3>館主名（ユーザー名）</h3>
          <input
            type="text"
            value={draft.dojo_name}
            onChange={(e) => update("dojo_name", e.target.value)}
            placeholder="例：山田太郎"
          />

          <h3>体重階級</h3>
          <p className="profile-readonly">{weightClass || "-"}</p>

          <button className="primary" onClick={handleSave}>
            設定を保存
          </button>
        </section>
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
