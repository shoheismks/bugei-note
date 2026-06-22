import { useEffect, useMemo, useState } from "react";
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
import { supabase } from "../lib/supabase";

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

const NAVY = "#0f172a";
const GOLD = "#c9a227";
const SLATE = "#475569";
const BORDER = "#dbe3ef";

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncateText(value, maxLength = 34) {
  const text = String(value || "-").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function wrapText(value, maxLength = 25, maxLines = 2) {
  const text = String(value || "-").replace(/\s+/g, " ").trim();
  const lines = [];

  for (let i = 0; i < text.length; i += maxLength) {
    lines.push(text.slice(i, i + maxLength));
  }

  return lines.slice(0, maxLines);
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
    (records || [])
      .filter((record) => record.date)
      .map((record) => new Date(record.date).toDateString())
  ).size;
}

function getLatestDate(records) {
  const times = (records || [])
    .map((record) => new Date(record.date).getTime())
    .filter((time) => Number.isFinite(time));

  if (times.length === 0) return "-";

  return new Date(Math.max(...times)).toLocaleDateString("ja-JP");
}

function getBodySummary(bodyRecords) {
  const records = [...(bodyRecords || [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  if (records.length === 0) {
    return {
      latestWeight: "-",
      latestBodyFat: "-",
      weightDelta: "-",
      bodyFatDelta: "-",
      label: "身体推移は未記録",
    };
  }

  const first = records[0];
  const latest = records[records.length - 1];
  const latestWeight = Number(latest.weight || 0);
  const latestBodyFat = Number(latest.bodyFat || 0);
  const firstWeight = Number(first.weight || 0);
  const firstBodyFat = Number(first.bodyFat || 0);

  return {
    latestWeight: latestWeight ? `${latestWeight.toFixed(1)}kg` : "-",
    latestBodyFat: latestBodyFat ? `${latestBodyFat.toFixed(1)}%` : "-",
    weightDelta:
      latestWeight && firstWeight
        ? `${latestWeight - firstWeight >= 0 ? "+" : ""}${(
            latestWeight - firstWeight
          ).toFixed(1)}kg`
        : "-",
    bodyFatDelta:
      latestBodyFat && firstBodyFat
        ? `${latestBodyFat - firstBodyFat >= 0 ? "+" : ""}${(
            latestBodyFat - firstBodyFat
          ).toFixed(1)}%`
        : "-",
    label: `${records.length}件の身体推移`,
  };
}

function getStepSummary(stepRecords) {
  const records = stepRecords || [];
  const total = records.reduce((sum, record) => sum + Number(record.steps || 0), 0);
  const average = records.length ? Math.round(total / records.length) : 0;
  return {
    total,
    average,
    count: records.length,
  };
}

function Rank({
  overallScore,
  totalXp,
  weightClass,
  trainingRecords = [],
  martialRecords = [],
  bodyRecords = [],
  journalRecords = [],
  stepRecords = [],
  unlockedAchievements = [],
  unlockedTitles = [],
  selectedTitle,
  combatPower,
  getPartBestScore,
  getBestRecord,
  getRecordScore,
}) {
  const [rankingSummary, setRankingSummary] = useState({
    rank: "-",
    total: 0,
    powerGap: 0,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadRankingSummary() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("ranking_profiles")
        .select("user_id, combat_power")
        .order("combat_power", { ascending: false });

      if (error || !isMounted) return;

      const rankings = data || [];
      const myIndex = rankings.findIndex((player) => player.user_id === user.id);
      const topPower = Number(rankings[0]?.combat_power || 0);
      const myPower =
        myIndex >= 0 ? Number(rankings[myIndex]?.combat_power || 0) : 0;

      setRankingSummary({
        rank: myIndex >= 0 ? myIndex + 1 : "-",
        total: rankings.length,
        powerGap: myIndex >= 0 ? Math.max(0, topPower - myPower) : 0,
      });
    }

    loadRankingSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const report = useMemo(() => {
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

    const martialReports = Object.entries(sumBy(martialRecords, "art")).map(
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
    const activeDays = getActiveDays([
      ...trainingRecords,
      ...martialRecords,
      ...bodyRecords,
      ...journalRecords,
      ...stepRecords,
    ]);
    const averageScore =
      partReports.length > 0
        ? Math.round(
            partReports.reduce((sum, item) => sum + item.score, 0) /
              partReports.length
          )
        : 0;
    const bodySummary = getBodySummary(bodyRecords);
    const stepSummary = getStepSummary(stepRecords);
    const topPart = strengthTop5[0];
    const weakestPart = weaknessTop5[0];
    const journalHint = journalRecords[0]?.text || journalRecords[0]?.memo || "";
    const achievementCount = unlockedAchievements.length;
    const titleCount = unlockedTitles.length;

    const patternTags = [
      trainingXp >= martialXp ? "鍛錬寄り" : "稽古寄り",
      activeDays >= 12 ? "継続型" : "記録密度は低め（推測）",
      trainedParts >= Math.ceil(parts.length * 0.7)
        ? "全身バランス型"
        : "部位の偏りあり（推測）",
      stepSummary.average >= 8000 ? "活動量高め" : "歩数は伸びしろ",
      bodyRecords.length > 1 ? "身体推移あり" : "身体推移は不足",
      journalRecords.length > 0 ? "内省ログあり" : "日誌は未記録",
    ];

    const directions = [
      `${weakestPart?.name || "未記録領域"}を週1回だけ追加し、盲点を潰す`,
      `歩数平均${stepSummary.average || 0}歩を基準に、活動量の底上げを見る`,
      "身体推移と鍛錬強度を同じ週で比較し、増減の理由を日誌に残す",
      "ランキング差は順位より戦闘力差で確認し、短期の上下に寄せすぎない",
      "推測：強み種目の伸びた翌日は低強度の稽古で疲労を逃がす",
    ];

    const catchCopies = [
      `静かに積み上げる${topPart?.name || "鍛錬"}型プレイヤー`,
      "数字と日誌で身体を編集する実践者",
      "強みを磨き、盲点を記録で潰す人",
      "鍛錬・稽古・歩数を横断する身体探求者",
      `${selectedTitle || "称号"}を背負うミニマル武道家`,
    ];

    const dataSources = [
      `鍛錬${trainingRecords.length}件`,
      `稽古${martialRecords.length}件`,
      `身体${bodyRecords.length}件`,
      `日誌${journalRecords.length}件`,
      `歩数${stepRecords.length}件`,
      `実績${achievementCount}件`,
      `称号${titleCount}件`,
      `順位${rankingSummary.rank}/${rankingSummary.total || "-"}`,
    ];

    return {
      reportDate,
      partReports,
      strengthTop5,
      weaknessTop5,
      trainingXp,
      martialXp,
      trainedParts,
      activeDays,
      averageScore,
      bodySummary,
      stepSummary,
      patternTags,
      directions,
      catchCopies,
      dataSources,
      journalHint,
      combatPowerTotal: combatPower?.total || 0,
    };
  }, [
    bodyRecords,
    combatPower,
    getBestRecord,
    getPartBestScore,
    journalRecords,
    martialRecords,
    rankingSummary,
    selectedTitle,
    stepRecords,
    trainingRecords,
    unlockedAchievements,
    unlockedTitles,
  ]);

  const exportInfographic = async () => {
    const svg = buildInfographicSvgV2({
      report,
      overallScore,
      totalXp,
      weightClass,
      rankingSummary,
    });

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
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
        link.download = `body-analysis-${Date.now()}.png`;
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
            <p className="report-eyebrow">Body Intelligence Analysis</p>
            <h2>身体診断アナリシス</h2>
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
            <p className="hint">{report.reportDate}</p>
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
            <span>ランキング</span>
            <strong>
              {rankingSummary.rank}/{rankingSummary.total || "-"}
            </strong>
          </div>
          <div>
            <span>鍛錬 / 稽古</span>
            <strong>
              {trainingRecords.length}/{martialRecords.length}
            </strong>
          </div>
          <div>
            <span>歩数平均</span>
            <strong>{report.stepSummary.average}</strong>
          </div>
        </div>

        <div className="report-grid">
          <section className="report-panel report-chart-panel">
            <h3>部位別スコア</h3>
            <div className="report-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.partReports}>
                  <XAxis dataKey="shortName" tickLine={false} axisLine={false} />
                  <YAxis hide domain={[0, "dataMax + 10"]} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[8, 8, 2, 2]}>
                    {report.partReports.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="report-panel">
            <h3>分析サマリー</h3>
            <p>強み：{report.strengthTop5[0]?.name || "-"}</p>
            <p>盲点：{report.weaknessTop5[0]?.name || "未記録領域"}</p>
            <p>根拠：{report.dataSources.join(" / ")}</p>
          </section>
        </div>

        <section className="report-panel">
          <h3>Best Records</h3>
          <div className="report-table">
            {report.partReports.map(({ name, score, rank, bestRecord, color }) => (
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

function svgText(text, x, y, options = {}) {
  const {
    size = 20,
    weight = 500,
    fill = NAVY,
    anchor = "start",
    family = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  } = options;

  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${escapeXml(text)}</text>`;
}

function svgWrappedText(text, x, y, maxLength, lineHeight, options = {}) {
  return wrapText(text, maxLength, options.maxLines || 2)
    .map((line, index) =>
      svgText(line, x, y + index * lineHeight, {
        size: options.size || 18,
        weight: options.weight || 500,
        fill: options.fill || SLATE,
      })
    )
    .join("");
}

function buildCard(x, y, width, height, title, body) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="20" fill="#ffffff" stroke="${BORDER}" stroke-width="2"/>
    ${svgText(title, x + 26, y + 42, { size: 22, weight: 850 })}
    ${body}
  `;
}

function buildRankList(items, x, y, width, maxScore, isWeakness = false) {
  return items
    .map((item, index) => {
      const rowY = y + index * 44;
      const score = item.score || 0;
      const barWidth = Math.max(8, Math.round((score / maxScore) * 118));
      const label =
        isWeakness && score === 0
          ? `${truncateText(item.name, 13)}（推測）`
          : truncateText(item.name, 16);

      return `
        ${svgText(index + 1, x, rowY, { size: 17, weight: 850, fill: GOLD })}
        ${svgText(label, x + 30, rowY, { size: 17, weight: 760 })}
        <rect x="${x + width - 154}" y="${rowY - 14}" width="118" height="10" rx="5" fill="#e5e7eb"/>
        <rect x="${x + width - 154}" y="${rowY - 14}" width="${barWidth}" height="10" rx="5" fill="${item.color || GOLD}"/>
        ${svgText(score, x + width - 8, rowY, { size: 15, weight: 850, anchor: "end" })}
      `;
    })
    .join("");
}

function buildInfographicSvg({ report, overallScore, totalXp, weightClass, rankingSummary }) {
  const maxScore = Math.max(...report.partReports.map((item) => item.score), 1);
  const latestDate = getLatestDate([
    ...report.partReports,
  ]);
  const sourceText = report.dataSources.join(" / ");

  const chartBars = report.partReports
    .map((item, index) => {
      const x = 108 + index * 118;
      const barHeight = Math.max(10, Math.round((item.score / maxScore) * 122));
      const y = 892 - barHeight;

      return `
        <rect x="${x}" y="${y}" width="56" height="${barHeight}" rx="12" fill="${item.color}"/>
        ${svgText(item.shortName, x + 28, 920, { size: 13, weight: 750, fill: SLATE, anchor: "middle" })}
      `;
    })
    .join("");

  const tags = report.patternTags
    .slice(0, 6)
    .map((tag, index) => {
      const x = 104 + (index % 2) * 242;
      const y = 1080 + Math.floor(index / 2) * 42;
      return `
        <rect x="${x}" y="${y}" width="212" height="30" rx="15" fill="${index % 2 ? "#fffbeb" : "#eff6ff"}" stroke="${index % 2 ? "#fde68a" : "#bfdbfe"}"/>
        ${svgText(truncateText(tag, 12), x + 16, y + 20, { size: 15, weight: 800 })}
      `;
    })
    .join("");

  const directions = report.directions
    .slice(0, 5)
    .map((item, index) =>
      svgText(`${index + 1}. ${truncateText(item, 30)}`, 666, 1080 + index * 36, {
        size: 15,
        fill: SLATE,
      })
    )
    .join("");

  const catchCopies = report.catchCopies
    .slice(0, 5)
    .map((copy, index) => {
      const y = 1424 + index * 43;
      return `
        <rect x="104" y="${y}" width="1032" height="32" rx="16" fill="${index % 2 ? "#fffbeb" : "#f8fafc"}"/>
        ${svgText(`${index + 1}. ${truncateText(copy, 46)}`, 126, y + 22, { size: 17, weight: 760 })}
      `;
    })
    .join("");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="1754" viewBox="0 0 1240 1754">
  <rect width="1240" height="1754" fill="#ffffff"/>
  <rect x="0" y="0" width="1240" height="230" fill="${NAVY}"/>
  <circle cx="1084" cy="50" r="120" fill="#1d4ed8" opacity="0.34"/>
  <circle cx="948" cy="144" r="76" fill="${GOLD}" opacity="0.18"/>
  ${svgText("BODY INTELLIGENCE REPORT", 80, 78, { size: 23, weight: 850, fill: GOLD })}
  ${svgText("身体診断アナリシス", 80, 132, { size: 48, weight: 900, fill: "#ffffff" })}
  ${svgText("根拠：" + truncateText(sourceText, 52), 80, 176, { size: 18, fill: "#cbd5e1" })}
  ${svgText(`作成日 ${report.reportDate}`, 80, 210, { size: 16, fill: "#94a3b8" })}

  ${buildCard(
    80,
    276,
    1080,
    164,
    "● 身体の要約",
    `
      ${svgText(Math.round(overallScore || 0), 118, 358, { size: 42, weight: 900 })}
      ${svgText("総合スコア", 118, 394, { size: 15, fill: SLATE })}
      ${svgText(totalXp, 306, 358, { size: 42, weight: 900 })}
      ${svgText("累計XP", 306, 394, { size: 15, fill: SLATE })}
      ${svgText(report.bodySummary.latestWeight, 494, 358, { size: 32, weight: 900 })}
      ${svgText(`体重 ${report.bodySummary.weightDelta}`, 494, 394, { size: 15, fill: SLATE })}
      ${svgText(report.stepSummary.average, 694, 358, { size: 34, weight: 900 })}
      ${svgText("平均歩数", 694, 394, { size: 15, fill: SLATE })}
      ${svgText(`${rankingSummary.rank}/${rankingSummary.total || "-"}`, 884, 358, { size: 32, weight: 900 })}
      ${svgText("ランキング", 884, 394, { size: 15, fill: SLATE })}
      ${svgText(weightClass || "-", 1038, 358, { size: 24, weight: 900, anchor: "middle" })}
      ${svgText("階級", 1038, 394, { size: 15, fill: SLATE, anchor: "middle" })}
    `
  )}

  ${buildCard(
    80,
    474,
    520,
    292,
    "▲ 強みTOP5",
    buildRankList(report.strengthTop5, 116, 548, 440, maxScore)
  )}

  ${buildCard(
    640,
    474,
    520,
    292,
    "▼ 弱み・盲点TOP5",
    buildRankList(report.weaknessTop5, 676, 548, 440, maxScore, true)
  )}

  ${buildCard(
    80,
    796,
    1080,
    180,
    "■ 鍛錬スコア図解",
    `
      ${chartBars}
      ${svgText(report.averageScore, 1024, 870, { size: 44, weight: 900, fill: GOLD, anchor: "middle" })}
      ${svgText("平均スコア", 1024, 904, { size: 15, fill: SLATE, anchor: "middle" })}
    `
  )}

  ${buildCard(
    80,
    1006,
    520,
    264,
    "◆ 身体パターンの特徴",
    `
      ${tags}
      ${svgWrappedText(`身体推移：${report.bodySummary.label} / 体脂肪 ${report.bodySummary.bodyFatDelta}`, 104, 1216, 28, 22, { size: 15, maxLines: 2 })}
      ${svgWrappedText(`日誌要約：${report.journalHint ? truncateText(report.journalHint, 36) : "未記録"}`, 104, 1252, 28, 22, { size: 15, maxLines: 2 })}
    `
  )}

  ${buildCard(
    640,
    1006,
    520,
    264,
    "→ 今後伸ばすべき方向性",
    directions
  )}

  ${buildCard(
    80,
    1302,
    1080,
    322,
    "✦ 私を一言で表すキャッチコピー5案",
    catchCopies
  )}

  ${svgText("ランキング・身体推移・実績・日誌・称号・歩数を加味。未記録領域の判断は推測として明記。過度な美化は禁止。", 80, 1688, { size: 15, fill: SLATE })}
</svg>`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number.toLocaleString("ja-JP") : "0";
}

function buildConsultingMetric(label, value, x, y, width) {
  return `
    <line x1="${x}" y1="${y - 18}" x2="${x}" y2="${y + 52}" stroke="${GOLD}" stroke-width="3"/>
    ${svgText(truncateText(value, 10), x + 18, y + 14, { size: 28, weight: 900 })}
    ${svgText(label, x + 18, y + 44, { size: 13, weight: 700, fill: SLATE })}
    <line x1="${x + width}" y1="${y - 12}" x2="${x + width}" y2="${y + 50}" stroke="#eef2f7"/>
  `;
}

function buildConsultingRankList(items, x, y, width, isWeakness = false) {
  const listMax = Math.max(...items.map((item) => Number(item.score || 0)), 1);
  const barX = x + 224;
  const barMax = 132;
  const scoreX = x + width - 6;

  return items
    .map((item, index) => {
      const rowY = y + index * 42;
      const score = Number(item.score || 0);
      const barWidth =
        score > 0 ? clamp(Math.round((score / listMax) * barMax), 6, barMax) : 0;
      const label =
        isWeakness && score === 0
          ? `${truncateText(item.name, 9)}（推測）`
          : truncateText(item.name, 12);

      return `
        <circle cx="${x + 8}" cy="${rowY - 5}" r="9" fill="#f8fafc" stroke="${GOLD}" stroke-width="1.5"/>
        ${svgText(index + 1, x + 8, rowY, {
          size: 12,
          weight: 900,
          fill: GOLD,
          anchor: "middle",
        })}
        ${svgText(label, x + 30, rowY, { size: 15, weight: 800 })}
        <rect x="${barX}" y="${rowY - 15}" width="${barMax}" height="8" rx="4" fill="#e5e7eb"/>
        <rect x="${barX}" y="${rowY - 15}" width="${barWidth}" height="8" rx="4" fill="${item.color || GOLD}"/>
        ${svgText(truncateText(formatNumber(score), 8), scoreX, rowY, {
          size: 13,
          weight: 850,
          anchor: "end",
        })}
      `;
    })
    .join("");
}

function buildInfographicSvgV2({
  report,
  overallScore,
  totalXp,
  weightClass,
  rankingSummary,
}) {
  const maxScore = Math.max(
    ...report.partReports.map((item) => Number(item.score || 0)),
    1
  );
  const sourceText = report.dataSources.join(" / ");
  const chartX = 118;
  const chartY = 874;
  const chartWidth = 700;
  const chartHeight = 142;
  const gap = 30;
  const barWidth = Math.floor(
    (chartWidth - gap * (report.partReports.length - 1)) /
      report.partReports.length
  );

  const chartBars = report.partReports
    .map((item, index) => {
      const score = Number(item.score || 0);
      const x = chartX + index * (barWidth + gap);
      const barHeight =
        score > 0 ? clamp(Math.round((score / maxScore) * 104), 6, 104) : 0;
      const y = chartY + chartHeight - barHeight;

      return `
        <rect x="${x}" y="${chartY + chartHeight - 104}" width="${barWidth}" height="104" rx="8" fill="#f1f5f9"/>
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="8" fill="${item.color}"/>
        ${svgText(truncateText(formatNumber(score), 7), x + barWidth / 2, chartY + chartHeight + 18, {
          size: 11,
          weight: 850,
          fill: NAVY,
          anchor: "middle",
        })}
        ${svgText(item.shortName, x + barWidth / 2, chartY + chartHeight + 36, {
          size: 12,
          weight: 800,
          fill: SLATE,
          anchor: "middle",
        })}
      `;
    })
    .join("");

  const tags = report.patternTags
    .slice(0, 6)
    .map((tag, index) => {
      const x = 112 + (index % 3) * 154;
      const y = 1192 + Math.floor(index / 3) * 34;
      return `
        <rect x="${x}" y="${y}" width="138" height="26" rx="13" fill="${index % 2 ? "#fffbeb" : "#eff6ff"}" stroke="${index % 2 ? "#f4d37a" : "#bfdbfe"}"/>
        ${svgText(truncateText(tag, 7), x + 12, y + 18, {
          size: 12,
          weight: 800,
        })}
      `;
    })
    .join("");

  const directions = report.directions
    .slice(0, 5)
    .map(
      (item, index) => `
        <g>
          <circle cx="676" cy="${1190 + index * 31}" r="9" fill="${NAVY}"/>
          ${svgText(index + 1, 676, 1194 + index * 31, {
            size: 11,
            weight: 900,
            fill: "#ffffff",
            anchor: "middle",
          })}
          ${svgText(truncateText(item, 28), 696, 1195 + index * 31, {
            size: 13,
            weight: 650,
            fill: SLATE,
          })}
        </g>`
    )
    .join("");

  const catchCopies = report.catchCopies
    .slice(0, 5)
    .map((copy, index) => {
      const y = 1448 + index * 39;
      return `
        <rect x="108" y="${y}" width="1024" height="30" rx="6" fill="${index % 2 ? "#fffbeb" : "#f8fafc"}"/>
        <rect x="108" y="${y}" width="4" height="30" rx="2" fill="${index % 2 ? GOLD : "#2563eb"}"/>
        ${svgText(`${index + 1}. ${truncateText(copy, 44)}`, 126, y + 21, {
          size: 15,
          weight: 760,
        })}
      `;
    })
    .join("");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="1754" viewBox="0 0 1240 1754">
  <rect width="1240" height="1754" fill="#ffffff"/>
  <rect x="0" y="0" width="1240" height="252" fill="${NAVY}"/>
  <rect x="80" y="74" width="5" height="114" fill="${GOLD}"/>
  <rect x="980" y="68" width="156" height="8" rx="4" fill="${GOLD}"/>
  <rect x="980" y="92" width="92" height="8" rx="4" fill="#3b82f6"/>
  ${svgText("BODY INTELLIGENCE REPORT", 104, 86, {
    size: 21,
    weight: 850,
    fill: GOLD,
  })}
  ${svgText("身体診断アナリシス", 104, 142, {
    size: 45,
    weight: 900,
    fill: "#ffffff",
  })}
  ${svgText("根拠：" + truncateText(sourceText, 64), 104, 184, {
    size: 16,
    fill: "#cbd5e1",
  })}
  ${svgText(`作成日 ${report.reportDate}`, 104, 216, {
    size: 14,
    fill: "#94a3b8",
  })}

  ${buildCard(
    80,
    294,
    1080,
    146,
    "身体の要約",
    `
      ${buildConsultingMetric("総合スコア", formatNumber(Math.round(overallScore || 0)), 116, 354, 170)}
      ${buildConsultingMetric("累計XP", formatNumber(totalXp), 304, 354, 170)}
      ${buildConsultingMetric(`体重 ${report.bodySummary.weightDelta}`, report.bodySummary.latestWeight, 492, 354, 170)}
      ${buildConsultingMetric("平均歩数", formatNumber(report.stepSummary.average), 680, 354, 170)}
      ${buildConsultingMetric("ランキング", `${rankingSummary.rank}/${rankingSummary.total || "-"}`, 868, 354, 150)}
      ${svgText(truncateText(weightClass || "-", 8), 1058, 368, {
        size: 20,
        weight: 900,
        anchor: "middle",
      })}
      ${svgText("階級", 1058, 398, {
        size: 13,
        weight: 700,
        fill: SLATE,
        anchor: "middle",
      })}
    `
  )}

  ${buildCard(
    80,
    476,
    520,
    268,
    "強み TOP5",
    buildConsultingRankList(report.strengthTop5, 116, 548, 438)
  )}

  ${buildCard(
    640,
    476,
    520,
    268,
    "弱み・盲点 TOP5",
    buildConsultingRankList(report.weaknessTop5, 676, 548, 438, true)
  )}

  ${buildCard(
    80,
    768,
    1080,
    324,
    "鍛錬スコア図解",
    `
      <rect x="104" y="850" width="760" height="190" rx="10" fill="#ffffff" stroke="#e2e8f0"/>
      <line x1="${chartX}" y1="${chartY + chartHeight}" x2="${chartX + chartWidth}" y2="${chartY + chartHeight}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${chartBars}
      <rect x="916" y="850" width="190" height="96" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
      ${svgText(formatNumber(report.averageScore), 1011, 895, {
        size: 38,
        weight: 900,
        fill: GOLD,
        anchor: "middle",
      })}
      ${svgText("平均スコア", 1011, 925, {
        size: 13,
        weight: 700,
        fill: SLATE,
        anchor: "middle",
      })}
      <rect x="916" y="966" width="190" height="44" rx="8" fill="#0f172a"/>
      ${svgText(`記録日数 ${formatNumber(report.activeDays)}`, 1011, 994, {
        size: 14,
        weight: 800,
        fill: "#ffffff",
        anchor: "middle",
      })}
    `
  )}

  ${buildCard(
    80,
    1124,
    520,
    244,
    "身体パターンの特徴",
    `
      ${tags}
      ${svgWrappedText(`身体推移：${report.bodySummary.label} / 体脂肪 ${report.bodySummary.bodyFatDelta}`, 112, 1286, 30, 18, { size: 12, maxLines: 2 })}
      ${svgWrappedText(`日誌要約：${report.journalHint ? truncateText(report.journalHint, 32) : "未記録"}`, 112, 1328, 30, 18, { size: 12, maxLines: 1 })}
    `
  )}

  ${buildCard(640, 1124, 520, 244, "今後伸ばすべき方向性", directions)}

  ${buildCard(
    80,
    1392,
    1080,
    270,
    "私を一言で表すキャッチコピー 5案",
    catchCopies
  )}

  ${svgText("ランキング・身体推移・実績・日誌・称号・歩数を加味。未記録領域の判断は推測として明記。過度な美化は禁止。", 80, 1698, {
    size: 13,
    fill: SLATE,
  })}
</svg>`;
}

export default Rank;
