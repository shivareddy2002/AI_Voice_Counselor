import { Mic, MicOff, Square } from "lucide-react";
import type { RecordingStatus } from "@/hooks/useMediaRecorder";

interface MicButtonProps {
  status: RecordingStatus;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function MicButton({ status, onStart, onStop, disabled }: MicButtonProps) {
  const isRecording = status === "recording";

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings */}
      {isRecording && (
        <>
          <span className="absolute h-32 w-32 animate-ping rounded-full bg-destructive/20 duration-1000" />
          <span className="absolute h-28 w-28 animate-pulse rounded-full bg-destructive/10" />
        </>
      )}
      <button
        onClick={isRecording ? onStop : onStart}
        disabled={disabled || status === "requesting"}
        className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 transition-all duration-300 active:scale-95 ${
          isRecording
            ? "border-destructive bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30"
            : disabled
            ? "border-muted bg-muted text-muted-foreground cursor-not-allowed"
            : "border-primary bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105"
        }`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <Square className="h-8 w-8" fill="currentColor" />
        ) : disabled ? (
          <MicOff className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </button>
    </div>
  );
}
