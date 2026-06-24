import StepStatsCard from "../components/steps/StepStatsCard";
import { Footprints, Trash2 } from "lucide-react";

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
    <main className="steps-main">
      <StepStatsCard stepRecords={stepRecords} />

      <section className="card hero steps-today-card">
        <div className="steps-today-heading">
          <div>
            <p className="metric-label">STEPS TODAY</p>
            <h2>今日の歩数</h2>
          </div>
          <Footprints aria-hidden="true" size={24} />
        </div>

        <div className="steps-today-value">
          {Number(todaySteps || 0).toLocaleString()}
        </div>

        <p className="hint">目標 {targetSteps.toLocaleString()}歩</p>

        <div className="steps-progress-bar">
          <span style={{ width: `${percent}%` }} />
        </div>

        <p className="steps-complete-label">{percent}% COMPLETE</p>
      </section>

      <section className="card steps-input-card">
        <input
          type="number"
          placeholder="歩数"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />

        <button
          className="primary steps-save-button"
          onClick={saveStepRecord}
        >
          <Footprints aria-hidden="true" size={18} />
          歩数を保存
        </button>
      </section>

      {stepRecords.length === 0 && (
        <section className="card steps-empty-card">
          <Footprints aria-hidden="true" size={30} />
          <h2>歩数記録はまだありません。</h2>
          <p className="hint">
            一歩目から、すでに修行。
          </p>
        </section>
      )}

      {stepRecords.length > 0 && (
        <section className="card steps-history-card">
          <h2>履歴</h2>

          <div className="steps-history-list">
            {stepRecords.map((record, index) => (
              <div className="steps-history-row" key={index}>
                <span>{new Date(record.date).toLocaleDateString("ja-JP")}</span>
                <strong>{Number(record.steps || 0).toLocaleString()}歩</strong>
                <button
                  className="steps-delete-button"
                  onClick={() => deleteStepRecord(index)}
                  aria-label={`${new Date(record.date).toLocaleDateString("ja-JP")}の歩数を削除`}
                >
                  <Trash2 aria-hidden="true" size={16} />
                  削除
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Steps;
