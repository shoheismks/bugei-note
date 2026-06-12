function HomeCalendarCard({
  trainingRecords,
  martialRecords,
  journalRecords,
  bodyRecords,
}) {
  const days = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const key = d.toDateString();

    const hasActivity =
      trainingRecords.some(
        (r) => new Date(r.date).toDateString() === key
      ) ||
      martialRecords.some(
        (r) => new Date(r.date).toDateString() === key
      ) ||
      journalRecords.some(
        (r) => new Date(r.date).toDateString() === key
      ) ||
      bodyRecords.some(
        (r) => new Date(r.date).toDateString() === key
      );

    days.push(hasActivity);
  }

  return (
    <section className="card">
      <h2>🏯 館主カレンダー</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
        }}
      >
        {days.map((active, index) => (
          <div
            key={index}
            style={{
              width: "100%",
              aspectRatio: "1",
              borderRadius: "4px",
              backgroundColor: active
                ? "#22c55e"
                : "#e5e7eb",
            }}
          />
        ))}
      </div>

      <p className="hint">
        過去30日の活動履歴
      </p>
    </section>
  );
}

export default HomeCalendarCard;