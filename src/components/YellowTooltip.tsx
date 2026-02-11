type Props = {
  children: React.ReactNode;
  /** When set, content is wrapped in a yellow pill and hover shows tooltip below with the value only (or "empty" if blank). Tooltip: bold text, no background. */
  oldValue?: string | null;
};

/**
 * Wraps content for a "changed" cell: yellow pill shape inside cell + tooltip on hover.
 * Tooltip appears below the cell, shows the value only (or "empty" if blank), bold text, no background.
 * When oldValue is not provided, renders children only (no pill, no tooltip).
 */
export function YellowTooltip({ children, oldValue }: Props) {
  if (oldValue === undefined || oldValue === null) {
    return <>{children}</>;
  }
  const displayText = String(oldValue).trim() === "" ? "empty" : String(oldValue);
  return (
    <span className="group relative inline-block">
      <span className="inline-block rounded-full bg-yellow-100 px-2 py-0.5 ring-1 ring-yellow-200">
        {children}
      </span>
      <span
        className="pointer-events-none absolute left-0 top-full z-10 mt-1 hidden max-w-xs whitespace-normal rounded-md border border-black bg-red-100 px-2 py-1.5 text-xs font-bold text-black group-hover:block"
        role="tooltip"
      >
        {displayText}
      </span>
    </span>
  );
}
