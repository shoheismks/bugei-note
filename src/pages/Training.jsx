import { useState } from "react";
import { parts, exercisesByPart, timeBasedExercises } from "../data";
import { scoreToRank, scoreToSamuraiTitle } from "../rank";

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
  handlePartChange,
  saveTrainingRecord,
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