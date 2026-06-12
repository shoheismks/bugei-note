export function getWeightClass(gender, weight) {
  const w = Number(weight);

  if (!w) return "未登録";

  if (gender === "female") {
    if (w < 50) return "軽量級";
    if (w < 65) return "中量級";
    if (w < 80) return "重量級";
    return "超重量級";
  }

  if (w < 60) return "軽量級";
  if (w < 75) return "中量級";
  if (w < 90) return "重量級";
  return "超重量級";
}

export function getTotalXp(trainingRecords) {
  return trainingRecords.reduce((sum, record) => {
    return sum + Number(record.xp || 0);
  }, 0);
}