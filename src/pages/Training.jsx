import { useState } from "react";
import { parts, exercisesByPart, timeBasedExercises } from "../data";
import { scoreToRank, scoreToSamuraiTitle } from "../rank";
import { Dumbbell, Trash2 } from "lucide-react";

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

  const today = new Date().toDateString();
  const isToday = (date) => new Date(date).toDateString() === today;
  const todayRecords = trainingRecords.filter((record) => isToday(record.date));
  const todayXp = todayRecords.reduce(
    (sum, record) => sum + Number(record.xp || 0),
    0
  );
  const latestRecord = trainingRecords[trainingRecords.length - 1];

  const formatTrainingSet = (record) => {
    const isSimple =
      timeBasedExercises.includes(record.exercise) ||
      record.rule === "自由入力：有酸素" ||
      record.rule === "自由入力：時間" ||
      record.rule === "自由入力：回数" ||
      record.rule === "自由入力：武道補強";

    if (isSimple) return `${record.reps}`;

    return `${record.weight}kg × ${record.reps}回 × ${
      record.sets || "-"
    }セット`;
  };

  return (
    <main>
      <section className="card product-card training-status-card">
        <p className="metric-label">TRAINING LOG</p>
        <div className="training-status-grid">
          <div>
            <span>今日の稽古数</span>
            <strong>{todayRecords.length}</strong>
          </div>
          <div>
            <span>今日の獲得XP</span>
            <strong>{todayXp}</strong>
          </div>
          <div>
            <span>最新種目</span>
            <strong>{latestRecord?.exercise || "-"}</strong>
          </div>
        </div>
      </section>

      <section className="card training-form-card">
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

        <div className="training-form-grid">
          <label>
            <span>部位</span>
            <select
              value={trainingPart}
              onChange={(e) => handlePartChange(e.target.value)}
            >
              {parts.map((part) => (
                <option key={part}>{part}</option>
              ))}
            </select>
          </label>

          <label>
            <span>種目</span>
            <select
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
            >
              {exercisesByPart[trainingPart].map((item) => (
                <option key={item}>{item}</option>
              ))}
              <option value="自由入力">自由入力</option>
            </select>
          </label>
        </div>

        {isCustom && (
          <div className="training-form-grid">
            <label>
              <span>自由種目名</span>
              <input
                type="text"
                placeholder="例：坂道走、薪割り、石担ぎ"
                value={customExercise}
                onChange={(e) => setCustomExercise(e.target.value)}
              />
            </label>

            <label>
              <span>種目タイプ</span>
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
            </label>
          </div>
        )}

        <div className="training-form-grid compact">
          {!isTimeBased && (
            <label>
              <span>{isDumbbell ? "片手重量" : "重量"}</span>
              <input
                type="number"
                placeholder="kg"
                value={trainingWeight}
                onChange={(e) => setTrainingWeight(e.target.value)}
              />
            </label>
          )}

          <label>
            <span>
              {isTimeBased || customType === "time" || customType === "cardio"
                ? "時間・回数"
                : "回数"}
            </span>
            <input
              type="number"
              placeholder={
                isTimeBased || customType === "time" || customType === "cardio"
                  ? "例：60"
                  : "例：10"
              }
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </label>

          {!isTimeBased && customType !== "time" && customType !== "cardio" && (
            <label>
              <span>セット</span>
              <input
                type="number"
                placeholder="例：3"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
              />
            </label>
          )}
        </div>

        <label className="date-field">
          <span>日付</span>
          <input
            type="date"
            value={trainingDate}
            onChange={(e) => setTrainingDate(e.target.value)}
          />
        </label>

        <p className="hint">
          {isCustom && "自由種目はタイプに応じてXP計算します"}
          {!isCustom && isDumbbell && "ダンベル種目は片手重量で入力"}
          {!isCustom && isTimeBased && "時間・回数・秒数で入力"}
          {!isCustom &&
            !isDumbbell &&
            !isTimeBased &&
            "マシン・バーベルは表示重量で入力"}
        </p>

        <button className="primary training-save-button" onClick={handleSave}>
          <Dumbbell aria-hidden="true" size={18} />
          稽古記録を保存
        </button>
      </section>

      {trainingRecords.length === 0 && (
        <section className="card">
          <p>稽古記録はまだありません</p>
        </section>
      )}

      {trainingRecords.length > 0 && (
        <section className="card training-history-list">
          <h2>履歴</h2>

          {trainingRecords.map((record, index) => (
            <div className="training-history-item" key={index}>
              <div>
                <p className="history-date">
                  {new Date(record.date).toLocaleString()}
                </p>
                <h3>{record.exercise}</h3>
                <p className="history-volume">{formatTrainingSet(record)}</p>
              </div>

              <div className="history-score">
                <strong>+{record.xp || 0}XP</strong>
                <span>推定スコア：{getRecordScore(record).toFixed(1)}</span>
              </div>

              <button
                className="icon-outline-button"
                onClick={() => deleteTrainingRecord(index)}
                aria-label={`${record.exercise}を削除`}
              >
                <Trash2 aria-hidden="true" size={16} />
              </button>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default Training;
