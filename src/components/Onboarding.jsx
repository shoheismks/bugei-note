import { useState } from "react";

function Onboarding() {
  const [visible, setVisible] = useState(
    localStorage.getItem("shuhariOnboardingClosed") !== "true"
  );

  const close = () => {
    localStorage.setItem("shuhariOnboardingClosed", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section className="onboarding-panel">
      <h2>SHU・HA・RIへようこそ</h2>
      <ol>
        <li>プロフィールを設定</li>
        <li>身体記録を入力</li>
        <li>稽古を1件記録</li>
        <li>今日の任務を確認</li>
        <li>称号を集める</li>
      </ol>
      <button className="primary" onClick={close}>
        始める
      </button>
    </section>
  );
}

export default Onboarding;
