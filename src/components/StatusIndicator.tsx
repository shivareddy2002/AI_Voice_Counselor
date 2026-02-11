interface StatusIndicatorProps {
  status: "idle" | "listening" | "thinking" | "speaking" | "error" | "playback" | "stopped";
  message?: string;
}

export function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const labels: Record<string, string> = {
    idle: "Click the microphone to speak",
    listening: "🎙️ Listening…",
    thinking: "🧠 AI is thinking…",
    speaking: "🔊 AI is responding…",
    playback: "🔁 Playing back your recording…",
    stopped: "Recording stopped",
    error: message || "Something went wrong",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p
        className={`text-sm font-medium transition-all duration-300 ${
          status === "error" ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        {labels[status] || labels.idle}
      </p>
      {status === "thinking" && (
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}
      {status === "speaking" && (
        <div className="flex items-end gap-0.5 h-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-primary animate-pulse"
              style={{
                height: `${12 + Math.random() * 12}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.6s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
