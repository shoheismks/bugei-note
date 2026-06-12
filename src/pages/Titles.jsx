import { titles } from "../titles.js";

function Titles({ unlockedTitles }) {
  const safeUnlockedTitles = unlockedTitles || ["現代サムライ"];

  return (
    <main>
      <section className="card hero">
        <h2>🏅 称号図鑑</h2>

        <div className="big-rank">
          {safeUnlockedTitles.length}/{titles.length}
        </div>

        <p className="hint">
          条件を満たすと称号が解放されます。
        </p>
      </section>

      {titles.map((title) => {
        const unlocked = safeUnlockedTitles.includes(title.name);

        return (
          <section
            className="card"
            key={title.id}
            style={{
              opacity: unlocked ? 1 : 0.45,
            }}
          >
            <h3>
              {unlocked ? "🔓" : "🔒"}{" "}
              {unlocked ? title.name : "？？？"}
            </h3>

            <p>
              {unlocked
                ? title.description || "称号を獲得しました。"
                : title.condition || "解除条件はまだ不明です。"}
            </p>
          </section>
        );
      })}
    </main>
  );
}

export default Titles;