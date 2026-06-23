function HomeStreakCard({
  trainingStreak,
}) {
  return (
    <section className="card">
      <h2>連続稽古日数</h2>

      <div className="big-rank">
        {trainingStreak}日
      </div>

      <p className="hint">
        継続こそ最強の型。
      </p>
    </section>
  );
}

export default HomeStreakCard;