import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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
    JSON.parse(localStorage.getItem("bodyRecords") || "[]")
  );

  useEffect(() => {
    loadBodyRecords();
  }, []);

  const loadBodyRecords = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("body_records")
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
      weight: record.weight,
      bodyFat: record.body_fat,
    }));

    setBodyRecords(formattedRecords);
    localStorage.setItem(
      "bodyRecords",
      JSON.stringify(formattedRecords)
    );

    if (formattedRecords.length > 0) {
      const latest = formattedRecords[0];

      setSavedWeight(latest.weight || "未登録");
      setSavedBodyFat(latest.bodyFat || "未登録");

      localStorage.setItem("weight", latest.weight || "");
      localStorage.setItem("bodyFat", latest.bodyFat || "");
    }
  };

  const saveBodyRecord = async () => {
    if (!weight) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const newRecord = {
      date: new Date().toISOString(),
      weight,
      bodyFat,
    };

    if (user) {
      const { error } = await supabase
        .from("body_records")
        .insert({
          user_id: user.id,
          date: newRecord.date,
          weight: Number(weight),
          body_fat: bodyFat ? Number(bodyFat) : null,
        });

      if (error) {
        alert(error.message);
        return;
      }
    }

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