import type { RecordingStatus } from "@/hooks/useMediaRecorder";

interface DebugPanelProps {
  micStatus: RecordingStatus;
  recordingTime: number;
  audioSizeKB: number;
  micPermission: string;
}

export function DebugPanel({ micStatus, recordingTime, audioSizeKB, micPermission }: DebugPanelProps) {
  return (
    <details className="w-full max-w-md mx-auto mt-4">
      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
        Debug Info
      </summary>
      <div className="mt-2 rounded-lg border bg-card p-3 text-xs font-mono space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Mic Permission:</span>
          <span className={micPermission === "granted" ? "text-green-600" : "text-destructive"}>
            {micPermission}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span>{micStatus}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Recording Time:</span>
          <span>{recordingTime}s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Audio Size:</span>
          <span>{audioSizeKB} KB</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Format:</span>
          <span>webm/opus</span>
        </div>
      </div>
    </details>
  );
}
