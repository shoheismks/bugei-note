import { useEffect, useState } from "react";
import { estimateOneRepMax } from "../rank";
import { timeBasedExercises } from "../data";
import { calculateXpGain, getPartBestScoreFromRecords } from "../utils/trainingEngine";
import { supabase } from "../lib/supabase";

export function useTrainingRecords() {
  const [trainingRecords, setTrainingRecords] = useState(
    JSON.parse(localStorage.getItem("trainingRecords") || "[]")
  );

  const [trainingPart, setTrainingPart] = useState("胸");
  const [exercise, setExercise] = useState("ダンベルプレス");
  const [trainingWeight, setTrainingWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");

  useEffect(() => {
    loadTrainingRecords();
  }, []);

  const loadTrainingRecords = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("training_records")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      console.log(error.message);
      return;
    }

    const formattedRecords = (data || []).map((record) => ({
      id: record.id,
      date: record.date,
      part: record.category,
      exercise: record.exercise,
      weight: record.weight,
      reps: record.reps,
      sets: record.sets || "",
      xp: record.xp || 0,
      rule: record.rule || "",
      memo: record.memo || "",
    }));

    setTrainingRecords(formattedRecords);
    localStorage.setItem("trainingRecords", JSON.stringify(formattedRecords));
  };

  const getRecordScore = (record) => {
    if (timeBasedExercises.includes(record.exercise)) {
      return Number(record.reps) || 0;
    }

    return estimateOneRepMax(record.weight, record.reps);
  };

  const saveTrainingRecord = async ({
    isTimeBased,
    isDumbbell,
    checkAchievements,
    getPartBestScore,
    setLastXp,
    setRankUpMessage,
    setNewAchievement,
  }) => {
    if (!exercise) return;
    if (isTimeBased && !reps) return;
    if (!isTimeBased && (!trainingWeight || !reps)) return;

    const beforeUnlocked = checkAchievements(trainingRecords);
    const beforeIds = beforeUnlocked.map((item) => item.id);

    const beforeScore = getPartBestScore(trainingPart);

    const xpGain = calculateXpGain({
      isTimeBased,
      reps,
      trainingWeight,
      sets,
    });

    const newRecord = {
      date: new Date().toISOString(),
      part: trainingPart,
      exercise,
      weight: isTimeBased ? "" : trainingWeight,
      reps,
      sets: isTimeBased ? "" : sets,
      xp: xpGain,
      rule: isDumbbell ? "片手重量" : isTimeBased ? "秒数" : "表示重量",
    };

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from("training_records").insert({
        user_id: user.id,
        date: newRecord.date,
        category: newRecord.part,
        exercise: newRecord.exercise,
        weight: newRecord.weight ? Number(newRecord.weight) : null,
        reps: newRecord.reps ? Number(newRecord.reps) : null,
        sets: newRecord.sets ? Number(newRecord.sets) : null,
        xp: Number(newRecord.xp || 0),
        rule: newRecord.rule,
        memo: "",
      });

      if (error) {
        alert(error.message);
        return;
      }
    }

    const updated = [newRecord, ...trainingRecords];

    const afterScore = getPartBestScoreFromRecords(
      updated,
      trainingPart,
      getRecordScore
    );

    const afterUnlocked = checkAchievements(updated);
    const newlyUnlocked = afterUnlocked.find(
      (item) => !beforeIds.includes(item.id)
    );

    setTrainingRecords(updated);
    localStorage.setItem("trainingRecords", JSON.stringify(updated));

    setLastXp({
      xp: xpGain,
      exercise,
    });

    setRankUpMessage({
      part: trainingPart,
      beforeScore,
      afterScore,
    });

    if (newlyUnlocked) {
      setNewAchievement(newlyUnlocked);

      setTimeout(() => {
        setNewAchievement(null);
      }, 3500);
    }

    setTrainingWeight("");
    setReps("");
    setSets("");
  };

  const deleteTrainingRecord = (indexToDelete) => {
    const updated = trainingRecords.filter(
      (_, index) => index !== indexToDelete
    );

    setTrainingRecords(updated);
    localStorage.setItem("trainingRecords", JSON.stringify(updated));
  };

  const resetTrainingRecords = () => {
    setTrainingRecords([]);
    setTrainingPart("胸");
    setExercise("ダンベルプレス");
    setTrainingWeight("");
    setReps("");
    setSets("");
  };

  return {
    trainingRecords,
    setTrainingRecords,
    trainingPart,
    setTrainingPart,
    exercise,
    setExercise,
    trainingWeight,
    setTrainingWeight,
    reps,
    setReps,
    sets,
    setSets,
    saveTrainingRecord,
    deleteTrainingRecord,
    getRecordScore,
    resetTrainingRecords,
  };
}