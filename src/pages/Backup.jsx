function Backup() {
  const exportData = () => {
    const data = {
      appName: "SHU・HA・RI",
      version: "1.1",
      exportedAt: new Date().toISOString(),

      gender: localStorage.getItem("gender") || "male",
      selectedTitle:
        localStorage.getItem("selectedTitle") || "現代サムライ",

      targetWeight:
        localStorage.getItem("targetWeight") || "78",
      targetBodyFat:
        localStorage.getItem("targetBodyFat") || "15",

      bodyRecords: JSON.parse(
        localStorage.getItem("bodyRecords") || "[]"
      ),

      trainingRecords: JSON.parse(
        localStorage.getItem("trainingRecords") || "[]"
      ),

      martialRecords: JSON.parse(
        localStorage.getItem("martialRecords") || "[]"
      ),

      journalRecords: JSON.parse(
        localStorage.getItem("journalRecords") || "[]"
      ),

      stepRecords: JSON.parse(
        localStorage.getItem("stepRecords") || "[]"
      ),

      techniqueLevels: JSON.parse(
        localStorage.getItem("techniqueLevels") || "{}"
      ),

      techniqueNotes: JSON.parse(
        localStorage.getItem("techniqueNotes") || "{}"
      ),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `bugei-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    a.click();

    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);

        if (!data || typeof data !== "object") {
          alert("バックアップデータの形式が正しくありません。");
          return;
        }

        const result = window.confirm(
          "現在のデータを上書きしますか？\n復元前に、念のため現在のバックアップを保存しておくことをおすすめします。"
        );

        if (!result) return;

        localStorage.setItem("gender", data.gender || "male");

        localStorage.setItem(
          "selectedTitle",
          data.selectedTitle || "現代サムライ"
        );

        localStorage.setItem(
          "targetWeight",
          data.targetWeight || "78"
        );

        localStorage.setItem(
          "targetBodyFat",
          data.targetBodyFat || "15"
        );

        localStorage.setItem(
          "bodyRecords",
          JSON.stringify(data.bodyRecords || [])
        );

        localStorage.setItem(
          "trainingRecords",
          JSON.stringify(data.trainingRecords || [])
        );

        localStorage.setItem(
          "martialRecords",
          JSON.stringify(data.martialRecords || [])
        );

        localStorage.setItem(
          "journalRecords",
          JSON.stringify(data.journalRecords || [])
        );

        localStorage.setItem(
          "stepRecords",
          JSON.stringify(data.stepRecords || [])
        );

        localStorage.setItem(
          "techniqueLevels",
          JSON.stringify(data.techniqueLevels || {})
        );

        localStorage.setItem(
          "techniqueNotes",
          JSON.stringify(data.techniqueNotes || {})
        );

        alert("復元しました。画面を再読み込みします。");
        window.location.reload();
      } catch (error) {
        alert("読み込みに失敗しました。JSONファイルを確認してください。");
      }
    };

    reader.readAsText(file);
  };

  const clearAllData = () => {
    const firstConfirm = window.confirm(
      "すべてのデータを削除しますか？"
    );

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "本当に削除しますか？この操作は取り消せません。"
    );

    if (!secondConfirm) return;

    localStorage.clear();

    alert("すべてのデータを削除しました。画面を再読み込みします。");
    window.location.reload();
  };

  return (
    <main>
      <section className="card hero">
        <h2>💾 バックアップ</h2>

        <p className="hint">
          SHU・HA・RIの記録をJSONファイルとして保存・復元します。
        </p>
      </section>

      <section className="card">
        <h2>データを書き出す</h2>

        <p className="hint">
          機種変更・ブラウザ削除対策として定期的に保存してください。
        </p>

        <button className="primary" onClick={exportData}>
          バックアップを書き出す
        </button>
      </section>

      <section className="card">
        <h2>データを復元する</h2>

        <p className="hint">
          保存したJSONファイルを読み込んで復元します。
        </p>

        <input
          type="file"
          accept="application/json"
          onChange={importData}
        />
      </section>

      <section className="card">
        <h2>危険操作</h2>

        <p className="hint">
          すべての記録を削除します。実行前にバックアップ推奨。
        </p>

        <button className="danger" onClick={clearAllData}>
          すべてのデータを削除
        </button>
      </section>
    </main>
  );
}

export default Backup;
