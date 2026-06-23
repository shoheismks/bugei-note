function Missions({
  trainingRecords,
  martialRecords,
  journalRecords,
  bodyRecords,
}) {
  const today = new Date().toDateString();

  const isToday = (date) => {
    return new Date(date).toDateString() === today;
  };

  const trainingDone = trainingRecords.some((record) =>
    isToday(record.date)
  );

  const martialDone = martialRecords.some((record) =>
    isToday(record.date)
  );

  const journalDone = journalRecords.some((record) =>
    isToday(record.date)
  );

  const bodyDone = bodyRecords.some((record) =>
    isToday(record.date)
  );

  const missions = [
    {
      name: "筋トレ・稽古を1件記録",
      done: trainingDone,
    },
    {
      name: "武芸を1件記録",
      done: martialDone,
    },
    {
      name: "武芸日誌を書く",
      done: journalDone,
    },
    {
      name: "身体記録をつける",
      done: bodyDone,
    },
  ];

  const completed = missions.filter((mission) => mission.done).length;

  return (
    <main>
      <section className="card hero">
        <h2>今日の館主ミッション</h2>

        <div className="big-rank">
          {completed}/{missions.length}
        </div>

        <p className="hint">
          今日やることを斬る。敵はだいたい昨日の自分。
        </p>
      </section>

      {missions.map((mission, index) => (
        <section className="card" key={index}>
          <h3>
            {mission.done ? "" : "□"} {mission.name}
          </h3>

          <p className="hint">
            {mission.done ? "達成済み" : "未達成"}
          </p>
        </section>
      ))}
    </main>
  );
}

export default Missions;