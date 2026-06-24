import { Activity } from "lucide-react";

function StepStatsCard({ stepRecords }) {
  const records = stepRecords || [];

  const today = new Date().toDateString();

  const todaySteps =
    records.find(
      (r) => new Date(r.date).toDateString() === today
    )?.steps || 0;

  const bestSteps =
    records.length > 0
      ? Math.max(...records.map((r) => Number(r.steps)))
      : 0;

  const totalSteps = records.reduce(
    (sum, r) => sum + Number(r.steps || 0),
    0
  );

  const averageSteps =
    records.length > 0
      ? Math.round(totalSteps / records.length)
      : 0;

  return (
    <section className="card step-stats-card">
      <div className="step-section-heading">
        <div>
          <p className="metric-label">STEPS</p>
          <h2>Activity</h2>
        </div>
        <Activity aria-hidden="true" size={22} />
      </div>

      <div className="step-stats-grid">
        <div>
          <span>今日の歩数</span>
          <strong>{todaySteps.toLocaleString()}</strong>
        </div>
        <div>
          <span>平均</span>
          <strong>{averageSteps.toLocaleString()}</strong>
        </div>
        <div>
          <span>累計</span>
          <strong>{totalSteps.toLocaleString()}</strong>
        </div>
        <div>
          <span>自己記録</span>
          <strong>{bestSteps.toLocaleString()}</strong>
        </div>
      </div>
    </section>
  );
}

export default StepStatsCard;
