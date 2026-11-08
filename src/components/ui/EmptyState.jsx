export default function EmptyState({ title, children }) {
  return (
    <div className="data-state data-state-empty">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
