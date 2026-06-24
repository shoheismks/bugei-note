import { Flame } from "lucide-react";

function HomeTrainingStreakCard({
  trainingRecords,
  martialRecords,
  stepRecords,
  journalRecords,
  bodyRecords,
}) {
  const days = [];

  const hasRecordOn = (records, key) => {
    return (records || []).some(
      (record) => new Date(record.date).toDateString() === key
    );
  };

  const getDayCount = (key) => {
    const hasPractice =
      hasRecordOn(trainingRecords, key) || hasRecordOn(martialRecords, key);
    const hasSteps = hasRecordOn(stepRecords, key);
    const hasBody = hasRecordOn(bodyRecords, key);
    const hasJournal = hasRecordOn(journalRecords, key);

    return [hasPractice, hasSteps, hasBody, hasJournal].filter(Boolean).length;
  };

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const key = d.toDateString();
    days.push({
      key,
      count: getDayCount(key),
      label: d.toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      }),
    });
  }

  const activeDaySet = new Set(
    [
      ...(trainingRecords || []),
      ...(martialRecords || []),
      ...(stepRecords || []),
      ...(bodyRecords || []),
      ...(journalRecords || []),
    ]
      .filter((record) => record.date)
      .map((record) => new Date(record.date).toDateString())
  );

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    if (!activeDaySet.has(d.toDateString())) break;
    streak += 1;
  }

  return (
    <section className="card training-streak-card">
      <div className="training-streak-heading">
        <div>
          <p className="metric-label">TRAINING STREAK</p>
          <h2>{streak} DAYS</h2>
          <p className="hint">稽古・歩数・身体記録・日誌のいずれかを記録した日を集計。</p>
        </div>
        <Flame aria-hidden="true" size={24} />
      </div>

      <div className="training-heatmap">
        {days.map((day) => (
          <div
            className={`heatmap-cell level-${Math.min(day.count, 3)}`}
            key={day.key}
            title={`${day.label}: ${day.count}件`}
          />
        ))}
      </div>

      <div className="training-streak-footer">
        <span>30 DAYS AGO</span>
        <span>過去30日の鍛錬状況</span>
        <span>TODAY</span>
      </div>
    </section>
  );
}

export default HomeTrainingStreakCard;
