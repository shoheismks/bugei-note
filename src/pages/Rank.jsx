import { parts, timeBasedExercises } from "../data";
import { scoreToRank, scoreToSamuraiTitle } from "../rank";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#0ea5e9",
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
];

const GOLD = "#c9a227";
const NAVY = "#0f172a";

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function chunkText(text, maxLength = 24) {
  const source = String(text || "-");
  const chunks = [];

  for (let i = 0; i < source.length; i += maxLength) {
    chunks.push(source.slice(i, i + maxLength));
  }

  return chunks.slice(0, 3);
}

function sumBy(records, key, valueKey = "xp") {
  return (records || []).reduce((acc, record) => {
    const name = record[key] || "未分類";
    acc[name] = (acc[name] || 0) + Number(record[valueKey] || 0);
    return acc;
  }, {});
}

function getActiveDays(records) {
  return new Set(
    (records || []).map((record) => new Date(record.date).toDateString())
  ).size;
}

function getLatestDate(records) {
  if (!records || records.length === 0) return "-";

  return new Date(
    Math.max(...records.map((record) => new Date(record.date).getTime()))
  ).toLocaleDateString("ja-JP");
}

function Rank({
  overallScore,
  totalXp,
  weightClass,
  trainingRecords = [],
  martialRecords = [],
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

    return {
      type: "鍛錬",
      name: part,
      shortName: String(part).slice(0, 4),
      score: Math.round(score || 0),
      rank: scoreToRank(score),
      title: scoreToSamuraiTitle(score),
      bestRecord,
      count: trainingRecords.filter((record) => record.part === part).length,
      color: COLORS[index % COLORS.length],
    };
  });

  const martialXpByArt = sumBy(martialRecords, "art");
  const martialReports = Object.entries(martialXpByArt).map(
    ([name, xp], index) => ({
      type: "稽古",
      name,
      shortName: String(name).slice(0, 4),
      score: Math.round(xp),
      rank: `${Math.round(xp)}XP`,
      title: "稽古XP",
      count: martialRecords.filter((record) => record.art === name).length,
      color: COLORS[(index + 3) % COLORS.length],
    })
  );

  const combinedReports = [...partReports, ...martialReports];
  const strengthTop5 = [...combinedReports]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const weaknessTop5 = [...combinedReports]
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  const trainingXp = trainingRecords.reduce(
    (sum, record) => sum + Number(record.xp || 0),
    0
  );
  const martialXp = martialRecords.reduce(
    (sum, record) => sum + Number(record.xp || 0),
    0
  );
  const trainedParts = partReports.filter((item) => item.score > 0).length;
  const activeDays = getActiveDays([...trainingRecords, ...martialRecords]);
  const averageScore =
    partReports.length > 0
      ? Math.round(
          partReports.reduce((sum, item) => sum + item.score, 0) /
            partReports.length
        )
      : 0;
  const topPart = strengthTop5[0];
  const weakestPart = weaknessTop5[0];

  const patternTags = [
    trainingXp >= martialXp ? "鍛錬寄り" : "稽古寄り",
    activeDays >= 8 ? "継続型" : "単発集中型（推測）",
    trainedParts >= Math.ceil(parts.length * 0.7)
      ? "全身バランス型"
      : "偏りあり（推測）",
    averageScore >= 60 ? "高出力傾向" : "基礎構築フェーズ",
  ];

  const directions = [
    `${weakestPart?.name || "未記録領域"}を週1回だけ追加し、盲点を潰す`,
    "強み種目は記録を継続し、重量・回数・秒数のどれか1指標で比較する",
    "稽古XPと鍛錬XPの差を月次で見て、偏りを数値で確認する",
    "推測：疲労管理のため、伸びた翌日は低強度の技術練習に寄せる",
  ];

  const catchCopies = [
    `静かに積み上げる${topPart?.name || "鍛錬"}型プレイヤー`,
    "数字で自分を鍛えるミニマル武道家",
    "強みを磨き、盲点を記録で潰す人",
    "鍛錬と稽古を横断する実践型アスリート",
    "派手さより継続で勝つ身体探求者",
  ];

  const exportInfographic = async () => {
    const svg = buildInfographicSvg({
      reportDate,
      overallScore,
      totalXp,
      weightClass,
      trainingRecords,
      martialRecords,
      partReports,
      strengthTop5,
      weaknessTop5,
      patternTags,
      directions,
      catchCopies,
      trainingXp,
      martialXp,
      activeDays,
      trainedParts,
      averageScore,
    });

    const blob = new Blob([svg], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1240;
      canvas.height = 1754;

      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;

        const downloadUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `training-infographic-${Date.now()}.png`;
        link.click();

        URL.revokeObjectURL(downloadUrl);
        URL.revokeObjectURL(url);
      }, "image/png");
    };

    image.src = url;
  };

  return (
    <main>
      <section className="card report-card">
        <div className="report-toolbar">
          <div>
            <p className="report-eyebrow">Body Intelligence Infographic</p>
            <h2>身体診断レポート</h2>
          </div>

          <button
            className="primary report-export-button"
            onClick={exportInfographic}
          >
            エクスポート
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
            <span>記録日数</span>
            <strong>{activeDays}</strong>
          </div>
          <div>
            <span>鍛錬 / 稽古</span>
            <strong>
              {trainingRecords.length}/{martialRecords.length}
            </strong>
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
                  <XAxis dataKey="shortName" tickLine={false} axisLine={false} />
                  <YAxis hide domain={[0, "dataMax + 10"]} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[8, 8, 2, 2]}>
                    {partReports.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="report-panel">
            <h3>分析サマリー</h3>
            <p>強み：{topPart?.name || "-"} / {topPart?.rank || "-"}</p>
            <p>
              盲点：{weakestPart?.name || "未記録領域"} /{" "}
              {weakestPart?.rank || "記録待ち"}
            </p>
            <p>
              根拠：過去の鍛錬記録 {trainingRecords.length}件、稽古記録{" "}
              {martialRecords.length}件のみ。
            </p>
          </section>
        </div>

        <section className="report-panel">
          <h3>Best Records</h3>
          <div className="report-table">
            {partReports.map(({ name, score, rank, bestRecord, color }) => (
              <div className="report-row" key={name}>
                <span className="report-dot" style={{ background: color }} />
                <strong>{name}</strong>
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
                      : `${bestRecord.weight}kg x ${bestRecord.reps}回`}
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

function buildInfographicSvg({
  reportDate,
  overallScore,
  totalXp,
  weightClass,
  trainingRecords,
  martialRecords,
  partReports,
  strengthTop5,
  weaknessTop5,
  patternTags,
  directions,
  catchCopies,
  trainingXp,
  martialXp,
  activeDays,
  trainedParts,
  averageScore,
}) {
  const latestDate = getLatestDate([...trainingRecords, ...martialRecords]);
  const maxPartScore = Math.max(...partReports.map((item) => item.score), 1);

  const card = (x, y, width, height, title, icon, body) => `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="22" fill="#ffffff" stroke="#dbe3ef" stroke-width="2"/>
    <text x="${x + 26}" y="${y + 44}" font-size="23" font-weight="800" fill="${NAVY}">${icon} ${escapeXml(title)}</text>
    ${body}
  `;

  const listRows = (items, x, y, width, kind) =>
    items
      .map((item, index) => {
        const score = item.score || 0;
        const barWidth = Math.max(20, Math.round((score / maxPartScore) * 180));
        const rowY = y + index * 54;
        const label =
          kind === "weakness" && score === 0
            ? `${item.name}（推測：記録なし）`
            : item.name;

        return `
          <text x="${x}" y="${rowY}" font-size="18" font-weight="800" fill="${GOLD}">${index + 1}</text>
          <text x="${x + 32}" y="${rowY}" font-size="18" font-weight="700" fill="${NAVY}">${escapeXml(label)}</text>
          <rect x="${x + width - 205}" y="${rowY - 16}" width="180" height="10" rx="5" fill="#e5e7eb"/>
          <rect x="${x + width - 205}" y="${rowY - 16}" width="${barWidth}" height="10" rx="5" fill="${item.color || GOLD}"/>
          <text x="${x + width - 18}" y="${rowY}" font-size="16" font-weight="800" text-anchor="end" fill="${NAVY}">${score}</text>
        `;
      })
      .join("");

  const wrappedLines = (lines, x, y, lineHeight = 28, size = 18) =>
    lines
      .map((line, index) => {
        const chunks = chunkText(line, 34);
        return chunks
          .map(
            (chunk, chunkIndex) => `
              <text x="${x}" y="${y + (index * 3 + chunkIndex) * lineHeight}" font-size="${size}" fill="#334155">${escapeXml(chunk)}</text>
            `
          )
          .join("");
      })
      .join("");

  const tags = patternTags
    .map(
      (tag, index) => `
        <rect x="${80 + (index % 2) * 245}" y="${1124 + Math.floor(index / 2) * 48}" width="220" height="34" rx="17" fill="${index % 2 === 0 ? "#eff6ff" : "#fffbeb"}" stroke="${index % 2 === 0 ? "#bfdbfe" : "#fde68a"}"/>
        <text x="${102 + (index % 2) * 245}" y="${1147 + Math.floor(index / 2) * 48}" font-size="17" font-weight="800" fill="${NAVY}">${escapeXml(tag)}</text>
      `
    )
    .join("");

  const directionLines = wrappedLines(
    directions.map((item, index) => `${index + 1}. ${item}`),
    650,
    1124,
    24,
    17
  );

  const catchcopyLines = catchCopies
    .map(
      (copy, index) => `
        <rect x="${80}" y="${1434 + index * 44}" width="1080" height="34" rx="17" fill="${index % 2 === 0 ? "#f8fafc" : "#fffbeb"}"/>
        <text x="${104}" y="${1457 + index * 44}" font-size="18" font-weight="700" fill="${NAVY}">${index + 1}. ${escapeXml(copy)}</text>
      `
    )
    .join("");

  const bars = partReports
    .map((item, index) => {
      const x = 93 + index * 130;
      const height = Math.max(12, Math.round((item.score / maxPartScore) * 160));
      const y = 858 - height;

      return `
        <rect x="${x}" y="${y}" width="72" height="${height}" rx="12" fill="${item.color}"/>
        <text x="${x + 36}" y="884" font-size="15" font-weight="700" fill="#475569" text-anchor="middle">${escapeXml(item.shortName)}</text>
      `;
    })
    .join("");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="1754" viewBox="0 0 1240 1754">
  <rect width="1240" height="1754" fill="#ffffff"/>
  <rect x="0" y="0" width="1240" height="250" fill="${NAVY}"/>
  <circle cx="1080" cy="64" r="128" fill="#1d4ed8" opacity="0.32"/>
  <circle cx="950" cy="158" r="86" fill="${GOLD}" opacity="0.18"/>

  <text x="80" y="82" font-size="24" font-weight="800" fill="${GOLD}">BODY INTELLIGENCE REPORT</text>
  <text x="80" y="138" font-size="52" font-weight="900" fill="#ffffff">身体診断インフォグラフィック</text>
  <text x="80" y="184" font-size="22" fill="#cbd5e1">根拠：過去の鍛錬記録・稽古記録のみ / 推測は推測と明記</text>
  <text x="80" y="220" font-size="18" fill="#94a3b8">作成日 ${escapeXml(reportDate)} / 最終記録 ${escapeXml(latestDate)}</text>

  ${card(
    80,
    294,
    1080,
    178,
    "身体の要約",
    "◉",
    `
      <text x="116" y="380" font-size="46" font-weight="900" fill="${NAVY}">${Math.round(overallScore || 0)}</text>
      <text x="116" y="418" font-size="17" fill="#64748b">総合スコア</text>
      <text x="338" y="380" font-size="46" font-weight="900" fill="${NAVY}">${escapeXml(totalXp)}</text>
      <text x="338" y="418" font-size="17" fill="#64748b">累計XP</text>
      <text x="560" y="380" font-size="46" font-weight="900" fill="${NAVY}">${activeDays}</text>
      <text x="560" y="418" font-size="17" fill="#64748b">記録日数</text>
      <text x="782" y="380" font-size="28" font-weight="900" fill="${NAVY}">${escapeXml(weightClass || "-")}</text>
      <text x="782" y="418" font-size="17" fill="#64748b">階級</text>
      <text x="972" y="380" font-size="32" font-weight="900" fill="${NAVY}">${trainedParts}/${partReports.length}</text>
      <text x="972" y="418" font-size="17" fill="#64748b">鍛錬部位</text>
    `
  )}

  ${card(
    80,
    502,
    520,
    330,
    "強みTOP5",
    "▲",
    listRows(strengthTop5, 116, 590, 440, "strength")
  )}

  ${card(
    640,
    502,
    520,
    330,
    "弱み・盲点TOP5",
    "▼",
    listRows(weaknessTop5, 676, 590, 440, "weakness")
  )}

  ${card(
    80,
    862,
    1080,
    200,
    "鍛錬スコア図解",
    "▰",
    `
      ${bars}
      <text x="1000" y="940" font-size="48" font-weight="900" fill="${GOLD}" text-anchor="middle">${averageScore}</text>
      <text x="1000" y="974" font-size="17" fill="#64748b" text-anchor="middle">平均スコア</text>
    `
  )}

  ${card(
    80,
    1092,
    520,
    260,
    "身体パターンの特徴",
    "◆",
    `
      ${tags}
      <text x="102" y="1268" font-size="17" fill="#475569">※記録量・部位分布からの分類。未記録領域は推測を含む。</text>
      <text x="102" y="1306" font-size="17" fill="#475569">鍛錬XP ${trainingXp} / 稽古XP ${martialXp}</text>
    `
  )}

  ${card(
    640,
    1092,
    520,
    260,
    "今後伸ばすべき方向性",
    "→",
    directionLines
  )}

  ${card(
    80,
    1382,
    1080,
    290,
    "私を一言で表すキャッチコピー5案",
    "✦",
    catchcopyLines
  )}

  <text x="80" y="1712" font-size="15" fill="#64748b">過度な美化を避け、記録から確認できる強み・弱みを客観的に整理。推測箇所は明記。</text>
</svg>`;
}

export default Rank;
