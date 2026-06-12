export function martialXpToRank(xp) {
  if (xp >= 5000) return "十段";
  if (xp >= 4000) return "九段";
  if (xp >= 3200) return "八段";
  if (xp >= 2500) return "七段";
  if (xp >= 1900) return "六段";
  if (xp >= 1400) return "五段";
  if (xp >= 1000) return "四段";
  if (xp >= 700) return "三段";
  if (xp >= 450) return "二段";
  if (xp >= 250) return "初段";
  if (xp >= 180) return "一級";
  if (xp >= 130) return "二級";
  if (xp >= 90) return "三級";
  if (xp >= 60) return "四級";
  if (xp >= 40) return "五級";
  if (xp >= 25) return "六級";
  if (xp >= 15) return "七級";
  if (xp >= 8) return "八級";
  if (xp >= 3) return "九級";

  return "十級";
}

export function martialTitle(rank) {
  const titles = {
    十級: "入門者",
    九級: "稽古人",
    八級: "初心の武士",
    七級: "見習い武芸者",
    六級: "木刀持ち",
    五級: "型の探究者",
    四級: "鍛錬者",
    三級: "修行人",
    二級: "古流研究生",
    一級: "武芸人",
    初段: "一人前",
    二段: "武士",
    三段: "兵法者",
    四段: "道場の柱",
    五段: "師範代",
    六段: "達人",
    七段: "剣豪",
    八段: "兵法家",
    九段: "武芸宗匠",
    十段: "剣聖",
  };

  return titles[rank] || "";
}

export function getNextMartialRankXp(xp) {
  const levels = [
    0, 3, 8, 15, 25, 40, 60, 90, 130, 180,
    250, 450, 700, 1000, 1400, 1900,
    2500, 3200, 4000, 5000,
  ];

  let current = 0;
  let next = 5000;

  for (let i = 0; i < levels.length - 1; i++) {
    if (xp >= levels[i] && xp < levels[i + 1]) {
      current = levels[i];
      next = levels[i + 1];
      break;
    }
  }

  const progress = xp - current;
  const required = next - current;

  return {
    current,
    next,
    remaining: Math.max(0, next - xp),
    percent: Math.min(100, Math.round((progress / required) * 100)),
  };
}