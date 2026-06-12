import { useState } from "react";

export function useJournalRecords() {
  const [journalText, setJournalText] = useState("");
  const [journalSearch, setJournalSearch] = useState("");

  const [journalRecords, setJournalRecords] = useState(
    JSON.parse(localStorage.getItem("journalRecords")) || []
  );

  const saveJournalRecord = () => {
    if (!journalText.trim()) return;

    const newRecord = {
      date: new Date().toISOString(),
      text: journalText,
    };

    const updated = [newRecord, ...journalRecords];

    setJournalRecords(updated);
    localStorage.setItem("journalRecords", JSON.stringify(updated));

    setJournalText("");
  };

  const deleteJournalRecord = (indexToDelete) => {
    const updated = journalRecords.filter(
      (_, index) => index !== indexToDelete
    );

    setJournalRecords(updated);
    localStorage.setItem("journalRecords", JSON.stringify(updated));
  };

  const resetJournalRecords = () => {
    setJournalText("");
    setJournalSearch("");
    setJournalRecords([]);
  };

  return {
    journalText,
    setJournalText,
    journalSearch,
    setJournalSearch,
    journalRecords,
    saveJournalRecord,
    deleteJournalRecord,
    resetJournalRecords,
  };
}