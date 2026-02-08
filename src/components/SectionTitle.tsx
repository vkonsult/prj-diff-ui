import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  icon: LucideIcon;
  right?: React.ReactNode;
};

export function SectionTitle({ title, icon: Icon, right }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="rounded bg-slate-100 p-1.5 ring-1 ring-slate-200">
          <Icon className="h-4 w-4 text-slate-700" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      {right}
    </div>
  );
}
