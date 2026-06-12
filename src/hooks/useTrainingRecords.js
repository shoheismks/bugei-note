import { useState } from "react";
import { estimateOneRepMax } from "../rank";
import { timeBasedExercises } from "../data";

export function useTrainingRecords() {
  const [trainingRecords, setTrainingRecords] = useState(
    JSON.parse(localStorage.getItem("trainingRecords")) || []
  );

  const [trainingPart, setTrainingPart] = useState("胸");
  const [exercise, setExercise] = useState("ダンベルプレス");
  const [trainingWeight, setTrainingWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");

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