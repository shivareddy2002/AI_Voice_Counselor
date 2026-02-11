interface AudioLevelMeterProps {
  level: number; // 0-1
  active: boolean;
}

export function AudioLevelMeter({ level, active }: AudioLevelMeterProps) {
  if (!active) return null;

  const bars = 12;
  const filledBars = Math.round(level * bars * 8); // amplify for visibility

  return (
    <div className="flex items-end justify-center gap-0.5 h-8" aria-label="Audio level meter">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-75 ${
            i < filledBars ? "bg-destructive" : "bg-muted"
          }`}
          style={{
            height: i < filledBars ? `${8 + (i / bars) * 24}px` : "4px",
          }}
        />
      ))}
    </div>
  );
}
