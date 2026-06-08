export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 rounded-2xl border border-ink/10 bg-white px-5 py-4 shadow-lift">
      <div className="flex items-center gap-4">
        <span className="font-bold text-ink">{message}</span>
        <button type="button" onClick={onClose} className="text-sm font-black text-ink/45">
          Uždaryti
        </button>
      </div>
    </div>
  );
}
