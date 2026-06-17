import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useTechniqueNotes() {
  const [notes, setNotes] = useState(() => {
    return JSON.parse(
      localStorage.getItem("techniqueNotes") || "{}"
    );
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
      console.log(error.message);
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

    localStorage.setItem(
      "techniqueNotes",
      JSON.stringify(loadedNotes)
    );
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
    const updated = {
      ...notes,
      [id]: data,
    };

    setNotes(updated);

    localStorage.setItem(
      "techniqueNotes",
      JSON.stringify(updated)
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: existing, error: selectError } = await supabase
      .from("technique_notes")
      .select("id")
      .eq("user_id", user.id)
      .eq("technique_id", id)
      .maybeSingle();

    if (selectError) {
      alert(selectError.message);
      return;
    }

    const payload = {
      point: data.point || "",
      mistake: data.mistake || "",
      teaching: data.teaching || "",
      insight: data.insight || "",
    };

    if (existing) {
      const { error } = await supabase
        .from("technique_notes")
        .update(payload)
        .eq("id", existing.id);

      if (error) {
        alert(error.message);
      }

      return;
    }

    const { error } = await supabase
      .from("technique_notes")
      .insert({
        user_id: user.id,
        technique_id: id,
        ...payload,
      });

    if (error) {
      alert(error.message);
    }
  };

  return {
    getNote,
    saveNote,
  };
}