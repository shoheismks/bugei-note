import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function BodyChartCard({
  bodyRecords,
  targetWeight,
  targetBodyFat,
}) {
  const safeTargetWeight = Number(targetWeight || 78);
  const safeTargetBodyFat = Number(targetBodyFat || 15);

  const records = [...(bodyRecords || [])]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((record) => ({
      rawDate: record.date,
      date: new Date(record.date).toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      }),
      weight: Number(record.weight || 0),
      bodyFat: Number(record.bodyFat || 0),
    }));

  if (records.length === 0) {
    return (
      <section className="card">
        <h2>身体推移</h2>
        <p className="hint">
          体重・体脂肪率を記録するとグラフが表示されます。
        </p>
      </section>
    );
  }

  const latestRecord = records[records.length - 1];
  const firstRecord = records[0];

  const currentWeight = latestRecord.weight;
  const currentBodyFat = latestRecord.bodyFat;

  const startWeight = firstRecord.weight;
  const startBodyFat = firstRecord.bodyFat;

  const weightChange = (currentWeight - startWeight).toFixed(1);
  const bodyFatChange = (currentBodyFat - startBodyFat).toFixed(1);

  const remainingWeight =
    currentWeight > 0
      ? Math.max(0, currentWeight - safeTargetWeight).toFixed(1)
      : "-";

  const remainingBodyFat =
    currentBodyFat > 0
      ? Math.max(0, currentBodyFat - safeTargetBodyFat).toFixed(1)
      : "-";

  const totalToLose = startWeight - safeTargetWeight;
  const lostAlready = startWeight - currentWeight;

  const progressPercent =
    totalToLose > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round((lostAlready / totalToLose) * 100)
          )
        )
      : 0;

  const daysPassed =
    records.length > 1
      ? (new Date(latestRecord.rawDate) - new Date(firstRecord.rawDate)) /
        (1000 * 60 * 60 * 24)
      : 0;

  const weeklyLoss =
    daysPassed > 0 ? (lostAlready / daysPassed) * 7 : 0;

  const weeksRemaining =
    weeklyLoss > 0 ? Number(remainingWeight) / weeklyLoss : 0;

  let estimatedDate = "計算中";

  if (weeksRemaining > 0 && Number(remainingWeight) > 0) {
    const future = new Date();

    future.setDate(
      future.getDate() + Math.round(weeksRemaining * 7)
    );

    estimatedDate = future.toLocaleDateString("ja-JP");
  }

  return (
    <section className="card">
      <h2>身体推移</h2>

      <div className="best-record">
        <p>進捗率：{progressPercent}%</p>

        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>

        <p>
          現在ペース：
          {weeklyLoss > 0 ? weeklyLoss.toFixed(2) : "-"}
          kg/週
        </p>

        <p>予想到達日：{estimatedDate}</p>

        <p>開始体重：{startWeight}kg</p>
        <p>現在体重：{currentWeight}kg</p>
        <p>目標体重：{safeTargetWeight}kg</p>
        <p>あと：{remainingWeight}kg</p>

        <p>
          変化：
          {weightChange > 0 ? "+" : ""}
          {weightChange}kg
        </p>

        <hr />

        <p>目標体脂肪率：{safeTargetBodyFat}%</p>
        <p>現在体脂肪率：{currentBodyFat}%</p>
        <p>あと：{remainingBodyFat}%</p>
        <p>開始時：{startBodyFat}%</p>

        <p>
          変化：
          {bodyFatChange > 0 ? "+" : ""}
          {bodyFatChange}%
        </p>
      </div>

      <h3>体重</h3>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={records}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#f2c14e"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3>体脂肪率</h3>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={records}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="bodyFat"
              stroke="#f2c14e"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default BodyChartCard;