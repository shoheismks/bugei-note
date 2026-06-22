import { parts, timeBasedExercises } from "../data";
import { scoreToRank, scoreToSamuraiTitle, scoreToXp } from "../rank";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Rank({
  overallScore,
  totalXp,
  weightClass,
  getPartBestScore,
  getBestRecord,
  getRecordScore,
}) {
  const reportDate = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const partReports = parts.map((part, index) => {
    const score = getPartBestScore(part);
    const bestRecord = getBestRecord(part);
    const progress = scoreToXp(score);

    return {
      part,
      shortPart: String(part).slice(0, 4),
      score: Math.round(score || 0),
      rank: scoreToRank(score),
      title: scoreToSamuraiTitle(score),
      progress,
      bestRecord,
      color: [
        "#38bdf8",
        "#3b82f6",
        "#6366f1",
        "#8b5cf6",
        "#14b8a6",
        "#22c55e",
        "#f59e0b",
        "#ef4444",
      ][index % 8],
    };
  });

  const topPart = [...partReports].sort((a, b) => b.score - a.score)[0];
  const weakestPart = [...partReports]
    .filter((item) => item.score > 0)
    .sort((a, b) => a.score - b.score)[0];

  const trainedParts = partReports.filter((item) => item.score > 0).length;
  const averageScore =
    partReports.length > 0
      ? Math.round(
          partReports.reduce((sum, item) => sum + item.score, 0) /
            partReports.length
        )
      : 0;

  return (
    <main>
      <section className="card report-card">
        <div className="report-toolbar">
          <div>
            <p className="report-eyebrow">Training Intelligence Report</p>
            <h2>トレーニング診断レポート</h2>
          </div>

          <button
            className="primary report-print-button"
            onClick={() => window.print()}
          >
            印刷
          </button>
        </div>

        <div className="report-hero">
          <div>
            <p className="hint">{reportDate}</p>
            <div className="report-rank">{scoreToRank(overallScore)}</div>
            <h3>{scoreToSamuraiTitle(overallScore)}</h3>
          </div>

          <div className="report-score-ring">
            <span>{Math.round(overallScore || 0)}</span>
            <small>score</small>
          </div>
        </div>

        <div className="report-metrics">
          <div>
            <span>累計XP</span>
            <strong>{totalXp}</strong>
          </div>
          <div>
            <span>階級</span>
            <strong>{weightClass}</strong>
          </div>
          <div>
            <span>記録部位</span>
            <strong>{trainedParts}/{parts.length}</strong>
          </div>
          <div>
            <span>平均スコア</span>
            <strong>{averageScore}</strong>
          </div>
        </div>

        <div className="report-grid">
          <section className="report-panel report-chart-panel">
            <h3>部位別スコア</h3>
            <div className="report-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={partReports}>
                  <XAxis dataKey="shortPart" tickLine={false} axisLine={false} />
                  <YAxis hide domain={[0, "dataMax + 10"]} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[8, 8, 2, 2]}>
                    {partReports.map((entry) => (
                      <Cell key={entry.part} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="report-panel">
            <h3>分析サマリー</h3>
            <p>
              強み：{topPart?.part || "-"} / {topPart?.rank || "-"}
            </p>
            <p>
              伸びしろ：{weakestPart?.part || "未記録部位"} /{" "}
              {weakestPart?.rank || "記録待ち"}
            </p>
            <p>
              次の一手：未記録または低スコア部位を1種目だけ追加し、週次で比較。
            </p>
          </section>
        </div>

        <section className="report-panel">
          <h3>Best Records</h3>
          <div className="report-table">
            {partReports.map(({ part, score, rank, bestRecord, color }) => (
              <div className="report-row" key={part}>
                <span className="report-dot" style={{ background: color }} />
                <strong>{part}</strong>
                <span>{rank}</span>
                <span>{score}</span>
                <small>
                  {bestRecord
                    ? timeBasedExercises.includes(bestRecord.exercise)
                      ? `${bestRecord.exercise} / ${bestRecord.reps}秒`
                      : `${bestRecord.exercise} / ${bestRecord.weight}kg x ${bestRecord.reps}`
                    : "記録なし"}
                </small>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="card">
        <h2>部位別段位</h2>

        {parts.map((part) => {
          const score = getPartBestScore(part);
          const bestRecord = getBestRecord(part);

          return (
            <div key={part} style={{ marginBottom: "20px" }}>
              <h3>{part}</h3>

              <p>
                {scoreToRank(score)}
                {" / "}
                {scoreToSamuraiTitle(score)}
              </p>

              {bestRecord ? (
                <>
                  <p>{bestRecord.exercise}</p>

                  <p>
                    {timeBasedExercises.includes(bestRecord.exercise)
                      ? `${bestRecord.reps}秒`
                      : `${bestRecord.weight}kg × ${bestRecord.reps}回`}
                  </p>

                  {!timeBasedExercises.includes(bestRecord.exercise) && (
                    <p>
                      推定1RM：
                      {getRecordScore(bestRecord).toFixed(1)}
                      kg
                    </p>
                  )}
                </>
              ) : (
                <p>記録なし</p>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default Rank;
