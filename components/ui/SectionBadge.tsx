interface SectionBadgeProps {
  label: string;
}

export default function SectionBadge({ label }: SectionBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-2">
      <div className="w-1.5 h-1.5 rounded-full bg-teal" />
      <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase">{label}</span>
    </div>
  );
}
