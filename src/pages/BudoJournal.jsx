function BudoJournal({
  journalText,
  setJournalText,
  journalSearch,
  setJournalSearch,
  journalRecords,
  saveJournalRecord,
  deleteJournalRecord,
}) {
  const filteredRecords = journalRecords.filter((record) =>
    record.text.toLowerCase().includes(journalSearch.toLowerCase())
  );

  return (
    <main>
      <section className="card">
        <h2>武芸日誌</h2>

        <textarea
          placeholder="今日の気づき・課題・身体感覚を書く"
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          rows="6"
        />

        <button className="primary" onClick={saveJournalRecord}>
          日誌を保存
        </button>
      </section>

      <section className="card">
        <h2>日誌検索</h2>

        <input
          type="text"
          placeholder="重心、抜刀、肩..."
          value={journalSearch}
          onChange={(e) => setJournalSearch(e.target.value)}
        />
      </section>

      {filteredRecords.length === 0 && (
        <section className="card">
          <p>該当する日誌がありません。</p>
        </section>
      )}

      {filteredRecords.map((record, index) => (
        <section className="card" key={index}>
          <p>{new Date(record.date).toLocaleString()}</p>

          <p>{record.text}</p>

          <button onClick={() => deleteJournalRecord(index)}>
            削除
          </button>
        </section>
      ))}
    </main>
  );
}

export default BudoJournal;