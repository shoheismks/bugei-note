function HomeQuestCard({
  todaySteps,
  bodyRecorded,
  trainingDone,
}) {
  const quests = [
    {
      title: "8000歩歩く",
      done: todaySteps >= 8000,
    },
    {
      title: "身体記録を入力",
      done: bodyRecorded,
    },
    {
      title: "トレーニング実施",
      done: trainingDone,
    },
  ];

  const completed = quests.filter((q) => q.done).length;

  const percent = Math.round(
    (completed / quests.length) * 100
  );

  return (
    <section className="card">
      <h2>📜 本日の任務</h2>

      <div className="big-rank">{percent}%</div>

      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      {quests.map((quest) => (
        <p key={quest.title}>
          {quest.done ? "✅" : "⬜"} {quest.title}
        </p>
      ))}
    </section>
  );
}

export default HomeQuestCard;