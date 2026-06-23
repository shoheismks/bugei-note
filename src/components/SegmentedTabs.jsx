function SegmentedTabs({ items, value, onChange }) {
  return (
    <div className="segmented-tabs">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={value === item.id ? "active" : ""}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedTabs;
