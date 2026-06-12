export function getTrainingStreak({
  trainingRecords,
  martialRecords,
  journalRecords,
  bodyRecords,
}) {
  const allRecords = [
    ...trainingRecords,
    ...martialRecords,
    ...journalRecords,
    ...bodyRecords,
  ];

  if (allRecords.length === 0) return 0;

  const recordDates = new Set(
    allRecords.map((record) =>
      new Date(record.date).toDateString()
    )
  );

  let streak = 0;
  const currentDate = new Date();

  while (true) {
    const dateString = currentDate.toDateString();

    if (recordDates.has(dateString)) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}