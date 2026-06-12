import { useState } from "react";

export function useStepRecords() {
  const [steps, setSteps] = useState("");

  const [stepRecords, setStepRecords] = useState(() => {
    return JSON.parse(
      localStorage.getItem("stepRecords") || "[]"
    );
  });

  const saveStepRecord = () => {
    if (!steps) return;

    const newRecord = {
      date: new Date().toISOString(),
      steps: Number(steps),
    };

    const updated = [newRecord, ...stepRecords];

    setStepRecords(updated);
    localStorage.setItem(
      "stepRecords",
      JSON.stringify(updated)
    );

    setSteps("");
  };

  const deleteStepRecord = (index) => {
    const updated = stepRecords.filter((_, i) => i !== index);

    setStepRecords(updated);
    localStorage.setItem(
      "stepRecords",
      JSON.stringify(updated)
    );
  };

  const resetStepRecords = () => {
    setStepRecords([]);
    localStorage.removeItem("stepRecords");
  };

  return {
    steps,
    setSteps,
    stepRecords,
    saveStepRecord,
    deleteStepRecord,
    resetStepRecords,
  };
}