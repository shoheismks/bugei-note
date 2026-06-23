import { Award, LockKeyhole, Sparkles, Trophy } from "lucide-react";
import { achievements } from "../achievements";

function Achievement({ unlockedAchievements }) {
  const totalAchievements = achievements.length;
  const unlockedCount = unlockedAchievements.length;
  const progress =
    totalAchievements > 0
      ? Math.round((unlockedCount / totalAchievements) * 100)
      : 0;
  const latestAchievement = unlockedAchievements[unlockedCount - 1];
  const remainingCount = Math.max(totalAchievements - unlockedCount, 0);
  const rarityCounts = unlockedAchievements.reduce((acc, achievement) => {
    const rarity = achievement.rarity || "一般";
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {});
  const raritySummary = ["一般", "Common", "希少", "Rare", "英傑", "Epic", "伝説", "Legendary", "神話"];

  return (
    <main>
      <section className="card hero achievement-hero">
        <div className="achievement-hero-heading">
          <div>
            <p className="metric-label">ACHIEVEMENTS</p>
            <h2>実績コレクション</h2>
          </div>
          <Trophy aria-hidden="true" size={24} />
        </div>

        <div className="achievement-unlocked">
          <strong>{unlockedCount}</strong>
          <span>UNLOCKED</span>
        </div>

        <div className="achievement-progress">
          <div>
            <span style={{ width: `${progress}%` }} />
          </div>
          <p>
            {totalAchievements}件中 {unlockedCount}件解放 / 残り{remainingCount}件
          </p>
        </div>

        <div className="achievement-hero-stats">
          <div>
            <span>達成率</span>
            <strong>{progress}%</strong>
          </div>
          <div>
            <span>最新実績</span>
            <strong>{latestAchievement?.name || "-"}</strong>
          </div>
        </div>
      </section>

      {unlockedAchievements.length === 0 && (
        <section className="card achievement-empty-card">
          <LockKeyhole aria-hidden="true" size={30} />
          <h2>まだ実績はありません</h2>
          <p className="hint">
            まずは稽古や身体記録を1件残して、最初の実績を解放しましょう。
          </p>
        </section>
      )}

      {unlockedAchievements.length > 0 && (
        <section className="card achievement-summary-card">
          <div className="achievement-section-heading">
            <Sparkles aria-hidden="true" size={20} />
            <div>
              <p className="metric-label">COLLECTION</p>
              <h2>解放状況</h2>
            </div>
          </div>

          <div className="achievement-rarity-grid">
            {raritySummary
              .filter((rarity) => rarityCounts[rarity])
              .map((rarity) => (
                <div key={rarity}>
                  <span>{rarity}</span>
                  <strong>{rarityCounts[rarity]}</strong>
                </div>
              ))}
          </div>
        </section>
      )}

      {unlockedAchievements.length > 0 && (
        <section className="card achievement-collection-card">
          <div className="achievement-section-heading">
            <Award aria-hidden="true" size={20} />
            <div>
              <p className="metric-label">UNLOCKED LIST</p>
              <h2>獲得済み</h2>
            </div>
          </div>

          <div className="achievement-grid">
            {unlockedAchievements.map((achievement) => (
              <article className="achievement-card" key={achievement.id}>
                <div className="achievement-card-icon">
                  <Award aria-hidden="true" size={20} />
                </div>
                <div>
                  <span className="achievement-rarity">
                    {achievement.rarity || "一般"}
                  </span>
                  <h3>{achievement.name}</h3>
                  <p>{achievement.comment || achievement.description || "達成済みの実績です。"}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Achievement;
