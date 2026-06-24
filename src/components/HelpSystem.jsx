import { HelpCircle, X } from "lucide-react";
import { useState } from "react";

const helpItems = [
  {
    title: "戦闘力",
    body: "筋力・武芸・継続・知識から算出。",
  },
  {
    title: "XP",
    body: "記録すると増加。レベルアップに使用。",
  },
  {
    title: "段位",
    body: "最高スコアで決定。",
  },
  {
    title: "称号",
    body: "条件達成で解放。",
  },
  {
    title: "武指数（将来）",
    body: "武の成長度。",
  },
];

function HelpSystem() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="help-floating-button"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="ヘルプを開く"
      >
        <HelpCircle aria-hidden="true" size={22} />
      </button>

      {open && (
        <div
          className="help-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-modal-title"
        >
          <section className="help-modal">
            <div className="help-modal-header">
              <div>
                <p className="metric-label">HELP</p>
                <h2 id="help-modal-title">用語ガイド</h2>
              </div>

              <button
                className="help-close-button"
                type="button"
                onClick={() => setOpen(false)}
                aria-label="ヘルプを閉じる"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </div>

            <div className="help-list">
              {helpItems.map((item) => (
                <div className="help-item" key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default HelpSystem;
