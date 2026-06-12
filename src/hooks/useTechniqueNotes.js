import { useState } from "react";

export function useTechniqueNotes() {
  const [notes, setNotes] = useState(() => {
    return JSON.parse(
      localStorage.getItem("techniqueNotes") || "{}"
    );
  });

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

  const saveNote = (id, data) => {
    const updated = {
      ...notes,
      [id]: data,
    };

    setNotes(updated);

    localStorage.setItem(
      "techniqueNotes",
      JSON.stringify(updated)
    );
  };

  return {
    getNote,
    saveNote,
  };
}