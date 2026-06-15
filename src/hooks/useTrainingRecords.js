import { useEffect, useState } from "react";
import { estimateOneRepMax } from "../rank";
import { timeBasedExercises } from "../data";
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
    localStorage.setItem(
      "trainingRecords",
      JSON.stringify(formattedRecords)
    );
  };

  const deleteTrainingRecord = (indexToDelete) => {
    const updated = trainingRecords.filter(
      (_, index) => index !== indexToDelete
    );

    setTrainingRecords(updated);
    localStorage.setItem("trainingRecords", JSON.stringify(updated));
  };

  const getRecordScore = (record) => {
    if (timeBasedExercises.includes(record.exercise)) {
      return Number(record.reps) || 0;
    }

    return estimateOneRepMax(record.weight, record.reps);
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
    deleteTrainingRecord,
    getRecordScore,
    resetTrainingRecords,
  };
}