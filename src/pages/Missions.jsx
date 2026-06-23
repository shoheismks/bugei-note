import { CheckCircle, Circle, Target } from "lucide-react";

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
  const progress = Math.round((completed / missions.length) * 100);

  return (
    <main className="missions-main">
      <section className="card hero missions-hero-card">
        <div className="missions-hero-heading">
          <div>
            <p className="metric-label">DAILY MISSIONS</p>
            <h2>Mission Board</h2>
          </div>
          <Target aria-hidden="true" size={24} />
        </div>

        <div className="missions-progress-count">
          <strong>{completed} / {missions.length}</strong>
          <span>今日やることを斬る。</span>
        </div>

        <div className="missions-progress-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="card missions-board-card">
        {missions.map((mission, index) => {
          const Icon = mission.done ? CheckCircle : Circle;

          return (
            <div
              className={`mission-row ${mission.done ? "is-done" : "is-pending"}`}
              key={index}
            >
              <Icon aria-hidden="true" size={22} />
              <div>
                <h3>{mission.name}</h3>
                <p>{mission.done ? "達成済み" : "未達成"}</p>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default Missions;
