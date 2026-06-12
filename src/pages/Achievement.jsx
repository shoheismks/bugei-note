function Achievement({ unlockedAchievements }) {
  return (
    <main>
      <section className="card hero">
        <h2>🏆 実績</h2>

        <div className="big-rank">
          {unlockedAchievements.length}
        </div>

        <p>解除済み実績</p>
      </section>

      {unlockedAchievements.length === 0 && (
        <section className="card">
          <p>解除済み実績はまだありません。</p>
          <p className="hint">
            まずは稽古を記録してください。話はそれからです。
          </p>
        </section>
      )}

      {unlockedAchievements.map((achievement) => (
        <section className="card achievement-card" key={achievement.id}>
          <h3>🏆 {achievement.name}</h3>

          <p>{achievement.rarity}</p>

          <p className="hint">館主コメント</p>

          <p>{achievement.comment}</p>
        </section>
      ))}
    </main>
  );
}

export default Achievement;