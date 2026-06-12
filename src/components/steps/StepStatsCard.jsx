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
    <section className="card">
      <h2>📊 歩数統計</h2>

      <p>今日：{todaySteps.toLocaleString()}歩</p>

      <p>自己記録：{bestSteps.toLocaleString()}歩</p>

      <p>平均：{averageSteps.toLocaleString()}歩</p>

      <p>累計：{totalSteps.toLocaleString()}歩</p>
    </section>
  );
}

export default StepStatsCard;