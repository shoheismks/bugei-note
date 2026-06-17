import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useTechniqueNotes() {
  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("techniqueNotes") || "{}");
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("technique_notes")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.log("LOAD NOTE ERROR:", error);
      return;
    }

    const loadedNotes = {};

    (data || []).forEach((record) => {
      loadedNotes[record.technique_id] = {
        point: record.point || "",
        mistake: record.mistake || "",
        teaching: record.teaching || "",
        insight: record.insight || "",
      };
    });

    setNotes(loadedNotes);
    localStorage.setItem("techniqueNotes", JSON.stringify(loadedNotes));
  };

  const getNote = (id) => {
    return (
      notes[id] || {
        point: "",
        mistake: "",
        teaching: "",
        insight: "",
      }
    );
  };

  const saveNote = async (id, data) => {
    console.log("SAVE NOTE:", id, data);

    const safeData = {
      point: data?.point || "",
      mistake: data?.mistake || "",
      teaching: data?.teaching || "",
      insight: data?.insight || "",
    };

    const updated = {
      ...notes,
      [id]: safeData,
    };

    setNotes(updated);
    localStorage.setItem("techniqueNotes", JSON.stringify(updated));

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("NOTE USER:", user);

    if (!user) {
      alert("ログイン情報が取得できませんでした");
      return;
    }

    const { data: existing, error: selectError } = await supabase
      .from("technique_notes")
      .select("id")
      .eq("user_id", user.id)
      .eq("technique_id", id)
      .maybeSingle();

    console.log("NOTE EXISTING:", existing);
    console.log("NOTE SELECT ERROR:", selectError);

    if (selectError) {
      alert(selectError.message);
      return;
    }

    if (existing) {
      const { data: updateData, error: updateError } = await supabase
        .from("technique_notes")
        .update(safeData)
        .eq("id", existing.id)
        .select();

      console.log("NOTE UPDATE DATA:", updateData);
      console.log("NOTE UPDATE ERROR:", updateError);

      if (updateError) {
        alert(updateError.message);
      }

      return;
    }

    const { data: insertData, error: insertError } = await supabase
      .from("technique_notes")
      .insert({
        user_id: user.id,
        technique_id: id,
        ...safeData,
      })
      .select();

    console.log("NOTE INSERT DATA:", insertData);
    console.log("NOTE INSERT ERROR:", insertError);

    if (insertError) {
      alert(insertError.message);
    }
  };

  return {
    getNote,
    saveNote,
  };
}