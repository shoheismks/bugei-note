export function getMissionBonus(missionCount) {
  if (missionCount >= 4) {
    return {
      achieved: true,
      xp: 20,
      title: "本日の任務達成",
      description: "今日の館主任務をすべて完了。+20XP相当。",
    };
  }

  return {
    achieved: false,
    xp: 0,
    title: "任務進行中",
    description: `あと${4 - missionCount}件で本日の任務達成。`,
  };
}