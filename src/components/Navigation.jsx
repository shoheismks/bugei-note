function Navigation({ setTab }) {
  return (
    <nav>
      <button onClick={() => setTab("home")}>ホーム</button>
      <button onClick={() => setTab("profile")}>プロフィール</button>
      <button onClick={() => setTab("body")}>身体</button>
      <button onClick={() => setTab("training")}>鍛錬</button>
      <button onClick={() => setTab("rank")}>レポート</button>
      <button onClick={() => setTab("ranking")}>ランキング</button>
      <button onClick={() => setTab("achievement")}>実績</button>
      <button onClick={() => setTab("martial")}>稽古</button>
      <button onClick={() => setTab("journal")}>日誌</button>
      <button onClick={() => setTab("titles")}>称号</button>
      <button onClick={() => setTab("missions")}>任務</button>
      <button onClick={() => setTab("steps")}>歩数</button>
      <button onClick={() => setTab("techniques")}>図鑑</button>
      <button onClick={() => setTab("backup")}>保存</button>
    </nav>
  );
}

export default Navigation;
