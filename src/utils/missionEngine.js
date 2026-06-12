export function getRecommendedMission({
  trainingRecords,
  martialRecords,
  journalRecords,
  bodyRecords,
}) {
  const today = new Date().toDateString();

  const isToday = (date) => {
    return new Date(date).toDateString() === today;
  };

  const bodyDone = bodyRecords.some((record) =>
    isToday(record.date)
  );

  const trainingDone = trainingRecords.some((record) =>
    isToday(record.date)
  );

  const martialDone = martialRecords.some((record) =>
    isToday(record.date)
  );

  const journalDone = journalRecords.some((record) =>
    isToday(record.date)
  );

  if (!bodyDone) {
    return {
      title: "体重を記録せよ",
      description: "己を知ることが、すべての始まり。",
    };
  }

  if (!trainingDone) {
    return {
      title: "筋トレ・稽古を1件記録せよ",
      description: "筋肉は裏切らない。たまに筋肉痛で裏切る。",
    };
  }

  if (!martialDone) {
    return {
      title: "武芸を1件記録せよ",
      description: "型を刻め。記録も刻め。",
    };
  }

  if (!journalDone) {
    return {
      title: "武芸日誌を書け",
      description: "今日の気づきは、明日の技になる。",
    };
  }

  return {
    title: "本日の任務完了",
    description: "今日はよく斬った。あとは回復も稽古。",
  };
}