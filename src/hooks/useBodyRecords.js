import { useState } from "react";
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

  const saveBodyRecord = async () => {
    console.log("SAVE BODY CLICKED");
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
      console.log("USER:", user);

      const { data, error } = await supabase
        .from("body_records")
        .insert({
          user_id: user.id,
          date: newRecord.date,
          weight: Number(weight),
          body_fat: bodyFat ? Number(bodyFat) : null,
        })
        .select();

      console.log("INSERT DATA:", data);
      console.log("INSERT ERROR:", error);

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