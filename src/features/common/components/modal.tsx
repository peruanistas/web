export function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="bg-white p-6 rounded shadow-lg relative"
        style={{ maxWidth: 800, width: '100%', pointerEvents: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="absolute top-2 right-2" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}
