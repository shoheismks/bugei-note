import { BookOpen, PenLine, Search, Trash2 } from "lucide-react";

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
      <section className="card journal-hero-card">
        <div className="journal-hero-heading">
          <div>
            <p className="metric-label">JOURNAL</p>
            <h2>Reflection Log</h2>
          </div>
          <BookOpen aria-hidden="true" size={24} />
        </div>

        <p className="hint">
          今日の気づき・課題・身体感覚を記録する。
        </p>

        <textarea
          className="journal-textarea"
          placeholder="今日の気づき、課題、身体感覚を書く"
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          rows="5"
        />

        <div className="journal-future-tags" aria-label="将来の分類">
          <span>観察</span>
          <span>分析</span>
          <span>応用</span>
          <span>指導</span>
        </div>

        <button className="primary journal-save-button" onClick={saveJournalRecord}>
          <PenLine aria-hidden="true" size={18} />
          日誌を保存
        </button>
      </section>

      <section className="card journal-search-card">
        <div className="journal-section-heading">
          <Search aria-hidden="true" size={20} />
          <div>
            <p className="metric-label">SEARCH NOTES</p>
            <h2>日誌検索</h2>
          </div>
        </div>

        <input
          type="text"
          placeholder="重心、抜刀、肩、呼吸..."
          value={journalSearch}
          onChange={(e) => setJournalSearch(e.target.value)}
        />
      </section>

      {filteredRecords.length === 0 && (
        <section className="card journal-empty-card">
          <BookOpen aria-hidden="true" size={30} />
          <h2>まだ記録がありません。</h2>
          <p className="hint">
            今日の小さな違和感を書いてみましょう。
          </p>
        </section>
      )}

      {filteredRecords.map((record, index) => (
        <section className="card journal-record-card" key={index}>
          <div className="journal-record-meta">
            <span>{new Date(record.date).toLocaleString()}</span>
            <span>REFLECTION</span>
          </div>

          <p className="journal-record-text">{record.text}</p>

          <div className="journal-insight-shell">
            <span>AI師範代の問い</span>
            <strong>準備中</strong>
          </div>

          <button
            className="journal-delete-button"
            onClick={() => deleteJournalRecord(index)}
          >
            <Trash2 aria-hidden="true" size={16} />
            削除
          </button>
        </section>
      ))}
    </main>
  );
}

export default BudoJournal;
