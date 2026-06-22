import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useStepRecords() {
  const [steps, setSteps] = useState("");
  const [stepDate, setStepDate] = useState("");

  const [stepRecords, setStepRecords] = useState(
    JSON.parse(localStorage.getItem("stepRecords") || "[]")
  );

  useEffect(() => {
    loadStepRecords();
  }, []);

  const loadStepRecords = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("step_records")
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
      steps: record.steps,
    }));

    setStepRecords(formattedRecords);

    localStorage.setItem(
      "stepRecords",
      JSON.stringify(formattedRecords)
    );
  };

  const saveStepRecord = async () => {
    if (!steps) return;

    const newRecord = {
      date: stepDate
        ? new Date(`${stepDate}T12:00:00`).toISOString()
        : new Date().toISOString(),
      steps: Number(steps),
    };

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("step_records")
        .insert({
          user_id: user.id,
          date: newRecord.date,
          steps: Number(newRecord.steps),
        });

      if (error) {
        alert(error.message);
        return;
      }
    }

    const updated = [newRecord, ...stepRecords];

    setStepRecords(updated);

    localStorage.setItem(
      "stepRecords",
      JSON.stringify(updated)
    );

    setSteps("");
    setStepDate("");
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
    setStepDate("");
    setStepRecords([]);
    localStorage.removeItem("stepRecords");
  };

  return {
    steps,
    setSteps,
    stepDate,
    setStepDate,
    stepRecords,
    saveStepRecord,
    deleteStepRecord,
    resetStepRecords,
  };
}
