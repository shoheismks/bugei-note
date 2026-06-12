import { useState } from "react";

export function useMartialRecords() {
  const [martialArt, setMartialArt] = useState("居合");
  const [martialMenu, setMartialMenu] = useState("素振り");
  const [martialCount, setMartialCount] = useState("");

  const [martialRecords, setMartialRecords] = useState(
    JSON.parse(localStorage.getItem("martialRecords")) || []
  );

  const saveMartialRecord = () => {
    if (!martialArt || !martialMenu || !martialCount) return;

    const xp = Math.max(1, Math.round(Number(martialCount) / 5));

    const newRecord = {
      date: new Date().toISOString(),
      art: martialArt,
      menu: martialMenu,
      count: martialCount,
      xp,
    };

    const updated = [newRecord, ...martialRecords];

    setMartialRecords(updated);
    localStorage.setItem("martialRecords", JSON.stringify(updated));

    setMartialCount("");
  };

  const deleteMartialRecord = (indexToDelete) => {
    const updated = martialRecords.filter(
      (_, index) => index !== indexToDelete
    );

    setMartialRecords(updated);
    localStorage.setItem("martialRecords", JSON.stringify(updated));
  };

  const resetMartialRecords = () => {
    setMartialArt("居合");
    setMartialMenu("素振り");
    setMartialCount("");
    setMartialRecords([]);
  };

  return {
    martialArt,
    setMartialArt,
    martialMenu,
    setMartialMenu,
    martialCount,
    setMartialCount,
    martialRecords,
    saveMartialRecord,
    deleteMartialRecord,
    resetMartialRecords,
  };
}