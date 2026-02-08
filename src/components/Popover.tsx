type Props = { open: boolean; onClose: () => void; children: React.ReactNode };

export function Popover({ open, onClose, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" onMouseDown={onClose}>
      <div className="absolute inset-0 bg-slate-900/20" />
      <div className="absolute left-1/2 top-16 w-[min(720px,calc(100%-1rem))] -translate-x-1/2 rounded-md bg-white p-4 shadow-xl ring-1 ring-slate-200" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
