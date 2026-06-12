import { achievements } from "../achievements";
import { getTotalXp } from "../utils";
import { techniques } from "../data/techniques";

export function getUnlockedAchievementsFromRecords(
  records,
  getOverallScoreFromRecords,
  getPartBestScoreFromRecords,
  trainingStreak = 0,
  stepRecords = [],
  learnedCount = 0,
  masteredCount = 0,
  techniqueLevels = {}
) {
  const total = getTotalXp(records);
  const overall = getOverallScoreFromRecords(records);

  const partScore = (part) => {
    return getPartBestScoreFromRecords(records, part);
  };

  const bestSteps = Math.max(
    0,
    ...stepRecords.map((record) => Number(record.steps || 0))
  );

  const getArtPercent = (art) => {
    const artTechniques = techniques.filter((t) => t.art === art);

    if (artTechniques.length === 0) return 0;

    const learned = artTechniques.filter((technique) => {
      return Number(techniqueLevels[technique.id] || 0) > 0;
    }).length;

    return Math.round((learned / artTechniques.length) * 100);
  };

  const iaidoPercent = getArtPercent("居合");
  const kenjutsuPercent = getArtPercent("剣術");
  const jujutsuPercent = getArtPercent("柔術");
  const jojutsuPercent = getArtPercent("杖術");

  return achievements.filter((achievement) => {
    if (achievement.id === "first_training") return records.length >= 1;
    if (achievement.id === "xp100") return total >= 100;
    if (achievement.id === "xp1000") return total >= 1000;
    if (achievement.id === "xp5000") return total >= 5000;

    if (achievement.id === "first_dan") return overall >= 50;
    if (achievement.id === "third_dan") return overall >= 60;
    if (achievement.id === "fifth_dan") return overall >= 70;
    if (achievement.id === "tenth_dan") return overall >= 95;

    if (achievement.id === "streak_3") return trainingStreak >= 3;
    if (achievement.id === "streak_7") return trainingStreak >= 7;
    if (achievement.id === "streak_30") return trainingStreak >= 30;
    if (achievement.id === "streak_100") return trainingStreak >= 100;

    if (achievement.id === "walk_5000") return bestSteps >= 5000;
    if (achievement.id === "walk_10000") return bestSteps >= 10000;
    if (achievement.id === "walk_20000") return bestSteps >= 20000;
    if (achievement.id === "walk_30000") return bestSteps >= 30000;

    if (achievement.id === "first_technique") return learnedCount >= 1;
    if (achievement.id === "technique_10") return learnedCount >= 10;
    if (achievement.id === "technique_20") return learnedCount >= 20;
    if (achievement.id === "teacher_5") return masteredCount >= 5;
    if (achievement.id === "teacher_10") return masteredCount >= 10;

    if (achievement.id === "iaido_master") return iaidoPercent >= 100;
    if (achievement.id === "kenjutsu_master") return kenjutsuPercent >= 100;
    if (achievement.id === "jujutsu_master") return jujutsuPercent >= 100;
    if (achievement.id === "jojutsu_master") return jojutsuPercent >= 100;

    if (achievement.id === "bugei_hyakuhan") {
      return (
        iaidoPercent >= 100 &&
        kenjutsuPercent >= 100 &&
        jujutsuPercent >= 100 &&
        jojutsuPercent >= 100
      );
    }

    if (achievement.id === "gowan") {
      return records.some(
        (record) =>
          record.exercise === "ダンベルプレス" &&
          Number(record.weight) >= 30
      );
    }

    if (achievement.id === "leg_bushou") return partScore("脚") >= 100;
    if (achievement.id === "chest_samurai") return partScore("胸") >= 35;
    if (achievement.id === "back_man") return partScore("背中") >= 80;
    if (achievement.id === "modern_samurai") return overall >= 80;
    if (achievement.id === "protein_beginner") return total >= 300;
    if (achievement.id === "protein_warrior") return total >= 1500;
    if (achievement.id === "protein_sennin") return total >= 3000;

    return false;
  });
}