import { useState } from "react";
import { parts, exercisesByPart, timeBasedExercises } from "../data";
import { scoreToRank, scoreToSamuraiTitle } from "../rank";

function parseCsvRows(text) {
  const [headerLine, ...lines] = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (!headerLine) return [];

  const headers = headerLine.split(",").map((header) => header.trim());

  return lines.map((line) => {
    const values = line.split(",").map((value) => value.trim());
    return headers.reduce((row, header, index) => {
      row[header] = values[index] || "";
      return row;
    }, {});
  });
}

function Training({
  trainingPart,
  exercise,
  trainingWeight,
  reps,
  sets,
  isTimeBased,
  isDumbbell,
  lastXp,
  rankUpMessage,
  trainingRecords,
  setExercise,
  setTrainingWeight,
  setReps,
  setSets,
  trainingDate,
  setTrainingDate,
  handlePartChange,
  saveTrainingRecord,
  importTrainingRecords,
  deleteTrainingRecord,
  getRecordScore,
}) {
  const [customExercise, setCustomExercise] = useState("");
  const [customType, setCustomType] = useState("strength");

  const beforeRank = rankUpMessage
    ? scoreToRank(rankUpMessage.beforeScore)
    : null;

  const afterRank = rankUpMessage
    ? scoreToRank(rankUpMessage.afterScore)
    : null;

  const beforeTitle = rankUpMessage
    ? scoreToSamuraiTitle(rankUpMessage.beforeScore)
    : null;

  const afterTitle = rankUpMessage
    ? scoreToSamuraiTitle(rankUpMessage.afterScore)
    : null;

  const isCustom = exercise === "自由入力";

  const isRankUp =
    rankUpMessage &&
    beforeRank !== afterRank &&
    beforeRank !== "未記録";

  const handleSave = () => {
    saveTrainingRecord({
      customExercise,
      customType,
    });

    setCustomExercise("");
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const count = await importTrainingRecords(parseCsvRows(reader.result));
      alert(`${count}件の鍛錬データを取り込みました`);
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <main>
      <section className="card">
        <h2>稽古記録</h2>

        {lastXp && (
          <div className="xp-toast">
            {lastXp.exercise}：+{lastXp.xp}XP 獲得
          </div>
        )}

        {isRankUp && (
          <div className="rank-up">
            <div>昇段！</div>

            <div style={{ marginTop: "10px" }}>
              {rankUpMessage.part}
            </div>

            <div>
              {beforeRank}→{afterRank}
            </div>

            <div style={{ marginTop: "10px" }}>
              称号：{beforeTitle}→{afterTitle}
            </div>
          </div>
        )}

        <select
          value={trainingPart}
          onChange={(e) => handlePartChange(e.target.value)}
        >
          {parts.map((part) => (
            <option key={part}>{part}</option>
          ))}
        </select>

        <select
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
        >
          {exercisesByPart[trainingPart].map((item) => (
            <option key={item}>{item}</option>
          ))}
          <option value="自由入力">自由入力</option>
        </select>

        {isCustom && (
          <>
            <input
              type="text"
              placeholder="自由種目名 例：石担ぎ、薪割り、坂道走"
              value={customExercise}
              onChange={(e) => setCustomExercise(e.target.value)}
            />

            <select
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
            >
              <option value="strength">筋力</option>
              <option value="cardio">有酸素</option>
              <option value="budo">武道補強</option>
              <option value="time">時間</option>
              <option value="reps">回数</option>
            </select>
          </>
        )}

        {!isTimeBased && (
          <input
            type="number"
            placeholder={isDumbbell ? "片手重量 kg" : "重量 kg"}
            value={trainingWeight}
            onChange={(e) => setTrainingWeight(e.target.value)}
          />
        )}

        <input
          type="number"
          placeholder={
            isTimeBased || customType === "time" || customType === "cardio"
              ? "時間・回数・秒数"
              : "回数"
          }
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />

        {!isTimeBased && customType !== "time" && customType !== "cardio" && (
          <input
            type="number"
            placeholder="セット数"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
        )}

        <input
          type="date"
          value={trainingDate}
          onChange={(e) => setTrainingDate(e.target.value)}
        />

        <p className="hint">
          {isCustom && "自由種目はタイプに応じてXP計算します"}
          {!isCustom && isDumbbell && "ダンベル種目は片手重量で入力"}
          {!isCustom && isTimeBased && "時間・回数・秒数で入力"}
          {!isCustom &&
            !isDumbbell &&
            !isTimeBased &&
            "マシン・バーベルは表示重量で入力"}
        </p>

        <button className="primary" onClick={handleSave}>
          稽古記録を保存
        </button>
      </section>

      <section className="card">
        <h2>過去の鍛錬データをインポート</h2>
        <p className="hint">
          CSV列: date,part,exercise,weight,reps,sets,xp
        </p>
        <input type="file" accept=".csv,text/csv" onChange={handleImport} />
      </section>

      {trainingRecords.length === 0 && (
        <section className="card">
          <p>稽古記録はまだありません</p>
        </section>
      )}

      {trainingRecords.map((record, index) => (
        <section className="card" key={index}>
          <p>{new Date(record.date).toLocaleString()}</p>

          <p>
            {record.part}：{record.exercise}
          </p>

          <p>
            {timeBasedExercises.includes(record.exercise) ||
            record.rule === "自由入力：有酸素" ||
            record.rule === "自由入力：時間" ||
            record.rule === "自由入力：回数" ||
            record.rule === "自由入力：武道補強"
              ? `${record.reps}`
              : `${record.weight}kg × ${record.reps}回 × ${
                  record.sets || "-"
                }セット`}
          </p>

          <p>入力ルール：{record.rule}</p>
          <p>推定スコア：{getRecordScore(record).toFixed(1)}</p>
          <p>獲得XP：+{record.xp || 0}XP</p>

          <button onClick={() => deleteTrainingRecord(index)}>
            削除
          </button>
        </section>
      ))}
    </main>
  );
}

export default Training;
