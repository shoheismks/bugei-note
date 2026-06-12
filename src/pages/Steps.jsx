import StepStatsCard from "../components/steps/StepStatsCard";
function Steps({
  steps,
  setSteps,
  stepRecords,
  saveStepRecord,
  deleteStepRecord,
}) {
  const today = new Date().toDateString();

  const todayRecord = stepRecords.find((record) => {
    return new Date(record.date).toDateString() === today;
  });

  const todaySteps = todayRecord ? todayRecord.steps : 0;
  const targetSteps = 10000;
  const percent = Math.min(
    100,
    Math.round((todaySteps / targetSteps) * 100)
  );

  return (
    <main>
        <StepStatsCard
            stepRecords={stepRecords}
            />
      <section className="card hero">
        <h2>🚶 歩数記録</h2>

        <div className="big-rank">
          {todaySteps}歩
        </div>

        <p>目標：{targetSteps}歩</p>

        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{
              width: `${percent}%`,
            }}
          />
        </div>

        <p>{percent}% 達成</p>
      </section>

      <section className="card">
        <h2>今日の歩数を記録</h2>

        <input
          type="number"
          placeholder="歩数"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />

        <button
          className="primary"
          onClick={saveStepRecord}
        >
          歩数を保存
        </button>
      </section>

      {stepRecords.length === 0 && (
        <section className="card">
          <p>歩数記録はまだありません。</p>
          <p className="hint">
            一歩目から、すでに修行。
          </p>
        </section>
      )}

      {stepRecords.map((record, index) => (
        <section className="card" key={index}>
          <p>
            {new Date(record.date).toLocaleString()}
          </p>

          <h3>{record.steps}歩</h3>

          <button
            onClick={() => deleteStepRecord(index)}
          >
            削除
          </button>
        </section>
      ))}
    </main>
  );
}

export default Steps;