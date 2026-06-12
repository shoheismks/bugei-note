import { useState } from "react";

export function useBodyRecords() {
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");

  const [savedWeight, setSavedWeight] = useState(
    localStorage.getItem("weight") || "未登録"
  );

  const [savedBodyFat, setSavedBodyFat] = useState(
    localStorage.getItem("bodyFat") || "未登録"
  );

  const [bodyRecords, setBodyRecords] = useState(
    JSON.parse(localStorage.getItem("bodyRecords")) || []
  );

  const saveBodyRecord = () => {
    if (!weight) return;

    const newRecord = {
      date: new Date().toISOString(),
      weight,
      bodyFat,
    };

    const updated = [newRecord, ...bodyRecords];

    setBodyRecords(updated);
    localStorage.setItem("bodyRecords", JSON.stringify(updated));
    localStorage.setItem("weight", weight);
    localStorage.setItem("bodyFat", bodyFat);

    setSavedWeight(weight);
    setSavedBodyFat(bodyFat || "未登録");

    setWeight("");
    setBodyFat("");
  };

  const deleteBodyRecord = (indexToDelete) => {
    const updated = bodyRecords.filter((_, index) => index !== indexToDelete);

    setBodyRecords(updated);
    localStorage.setItem("bodyRecords", JSON.stringify(updated));
  };

  const resetBodyRecords = () => {
    setWeight("");
    setBodyFat("");
    setSavedWeight("未登録");
    setSavedBodyFat("未登録");
    setBodyRecords([]);
  };

  return {
    weight,
    setWeight,
    bodyFat,
    setBodyFat,
    savedWeight,
    savedBodyFat,
    bodyRecords,
    saveBodyRecord,
    deleteBodyRecord,
    resetBodyRecords,
  };
}