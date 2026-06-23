import { Award, LockKeyhole, Sparkles } from "lucide-react";
import { titles } from "../titles.js";

function Titles({ unlockedTitles, selectedTitle }) {
  const safeUnlockedTitles = unlockedTitles || ["現代サムライ"];
  const unlockedCount = safeUnlockedTitles.length;
  const totalCount = titles.length;
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <main>
      <section className="card hero title-hero-card">
        <div className="title-hero-heading">
          <div>
            <p className="metric-label">TITLE COLLECTION</p>
            <h2>称号コレクション</h2>
          </div>
          <Award aria-hidden="true" size={24} />
        </div>

        <div className="title-unlocked-count">
          <strong>{unlockedCount} / {totalCount}</strong>
          <span>UNLOCKED</span>
        </div>

        <div className="title-progress">
          <div>
            <span style={{ width: `${progress}%` }} />
          </div>
          <p>{progress}% collected</p>
        </div>

        <p className="hint">
          条件を満たすと称号が解放されます。
        </p>
      </section>

      <section className="card title-collection-card">
        <div className="title-section-heading">
          <Sparkles aria-hidden="true" size={20} />
          <div>
            <p className="metric-label">LIBRARY</p>
            <h2>称号一覧</h2>
          </div>
        </div>

        <div className="title-grid">
          {titles.map((title) => {
            const unlocked = safeUnlockedTitles.includes(title.name);
            const equipped = unlocked && selectedTitle === title.name;

            return (
              <article
                className={`title-card ${unlocked ? "is-unlocked" : "is-locked"}`}
                key={title.id}
              >
                <div className="title-card-icon">
                  {unlocked ? (
                    <Award aria-hidden="true" size={18} />
                  ) : (
                    <LockKeyhole aria-hidden="true" size={18} />
                  )}
                </div>

                <div className="title-card-body">
                  <div className="title-card-topline">
                    <span className="title-rarity">
                      {unlocked ? title.rarity || "COMMON" : "LOCKED"}
                    </span>
                    {equipped && <span className="title-equipped">現在装備中</span>}
                  </div>

                  <h3>{unlocked ? title.name : "???"}</h3>
                  <p>
                    {unlocked
                      ? title.description || "称号を獲得しました。"
                      : title.condition || "隠し条件"}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Titles;
