import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useJournalRecords() {
  const [journalText, setJournalText] = useState("");
  const [journalSearch, setJournalSearch] = useState("");

  const [journalRecords, setJournalRecords] = useState(
    JSON.parse(localStorage.getItem("journalRecords") || "[]")
  );

  useEffect(() => {
    loadJournalRecords();
  }, []);

  const loadJournalRecords = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("journal_records")
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
      text: record.text,
    }));

    setJournalRecords(formattedRecords);

    localStorage.setItem(
      "journalRecords",
      JSON.stringify(formattedRecords)
    );
  };

  const saveJournalRecord = async () => {
    if (!journalText.trim()) return;

    const newRecord = {
      date: new Date().toISOString(),
      text: journalText,
    };

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("journal_records")
        .insert({
          user_id: user.id,
          date: newRecord.date,
          text: newRecord.text,
        });

      if (error) {
        alert(error.message);
        return;
      }
    }

    const updated = [newRecord, ...journalRecords];

    setJournalRecords(updated);

    localStorage.setItem(
      "journalRecords",
      JSON.stringify(updated)
    );

    setJournalText("");
  };

  const deleteJournalRecord = (indexToDelete) => {
    const updated = journalRecords.filter(
      (_, index) => index !== indexToDelete
    );

    setJournalRecords(updated);

    localStorage.setItem(
      "journalRecords",
      JSON.stringify(updated)
    );
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