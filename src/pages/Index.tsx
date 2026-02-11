import { useState, useRef, useCallback } from "react";
import { Headphones } from "lucide-react";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { getAdvisorResponse } from "@/hooks/useCourseAdvisor";
import { MicButton } from "@/components/MicButton";
import { StatusIndicator } from "@/components/StatusIndicator";
import { AudioLevelMeter } from "@/components/AudioLevelMeter";
import { DebugPanel } from "@/components/DebugPanel";
import { ConversationHistory, ConversationEntry } from "@/components/ConversationHistory";

type AppState = "idle" | "listening" | "stopped" | "playback" | "thinking" | "speaking" | "error";

const Index = () => {
  const {
    status: recStatus,
    audioUrl,
    audioSizeKB,
    recordingTime,
    micPermission,
    audioLevel,
    errorMessage,
    startRecording,
    stopRecording,
    reset,
  } = useMediaRecorder();

  const [appState, setAppState] = useState<AppState>("idle");
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [playbackVerified, setPlaybackVerified] = useState(false);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const idCounter = useRef(0);

  const handleStart = useCallback(() => {
    setTranscript("");
    setAiResponse("");
    setPlaybackVerified(false);

    // Start SpeechRecognition in parallel for transcript
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: any) => {
        const result = event.results[0]?.[0]?.transcript || "";
        setTranscript(result);
      };
      recognition.onerror = () => {};
      recognition.start();
      recognitionRef.current = recognition;
    }

    startRecording();
    setAppState("listening");
  }, [startRecording]);

  const handleStop = useCallback(() => {
    stopRecording();
    recognitionRef.current?.stop();
    setAppState("stopped");
  }, [stopRecording]);

  // When recStatus changes to "stopped" from outside (auto-stop)
  // sync appState
  const prevRecStatus = useRef(recStatus);
  if (recStatus === "stopped" && prevRecStatus.current === "recording" && appState === "listening") {
    setAppState("stopped");
    recognitionRef.current?.stop();
  }
  prevRecStatus.current = recStatus;

  const handlePlayback = useCallback(() => {
    if (!audioUrl) return;
    setAppState("playback");
    const audio = new Audio(audioUrl);
    playbackAudioRef.current = audio;
    audio.onended = () => {
      setPlaybackVerified(true);
      setAppState("stopped");
    };
    audio.play().catch(() => {
      setPlaybackVerified(true); // allow proceeding even if playback fails on some browsers
      setAppState("stopped");
    });
  }, [audioUrl]);

  const handleSendToAI = useCallback(() => {
    setAppState("thinking");

    // Simulate backend processing delay
    setTimeout(() => {
      const userText = transcript || "Could not transcribe audio";
      const response = getAdvisorResponse(userText);
      setAiResponse(response);

      // Add to conversation history (keep last 3)
      idCounter.current += 1;
      setConversations((prev) => [
        { id: idCounter.current, userText, aiText: response },
        ...prev,
      ].slice(0, 3));

      setAppState("speaking");

      // Speak the response
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => {
        setAppState("idle");
        reset();
      };
      speechSynthesis.speak(utterance);
    }, 1500);
  }, [transcript, reset]);

  const handleReset = useCallback(() => {
    speechSynthesis.cancel();
    reset();
    setAppState("idle");
    setTranscript("");
    setAiResponse("");
    setPlaybackVerified(false);
  }, [reset]);

  const effectiveState: AppState =
    recStatus === "error" ? "error" : appState;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Headphones className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Voice AI Course Advisor</h1>
            <p className="text-xs text-muted-foreground">Talk to an AI counselor for personalized course guidance</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8">
        {/* Mic Button */}
        <MicButton
          status={recStatus}
          onStart={handleStart}
          onStop={handleStop}
          disabled={micPermission === "denied" || appState === "thinking" || appState === "speaking"}
        />

        {/* Audio Level */}
        <AudioLevelMeter level={audioLevel} active={recStatus === "recording"} />

        {/* Status */}
        <StatusIndicator
          status={effectiveState}
          message={errorMessage || undefined}
        />

        {/* Post-recording actions */}
        {recStatus === "stopped" && audioUrl && appState !== "thinking" && appState !== "speaking" && (
          <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300">
            {!playbackVerified ? (
              <button
                onClick={handlePlayback}
                className="rounded-lg border bg-card px-6 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent hover:shadow-md active:scale-95"
              >
                ▶ Play Back Your Recording
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSendToAI}
                  className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95"
                >
                  ✅ Send to AI Advisor
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-lg border bg-card px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-accent active:scale-95"
                >
                  Re-record
                </button>
              </div>
            )}
          </div>
        )}

        {/* Transcript */}
        {transcript && appState !== "idle" && (
          <div className="w-full max-w-md rounded-lg border bg-card p-3 animate-in fade-in duration-300">
            <p className="text-xs font-medium text-muted-foreground mb-1">You said:</p>
            <p className="text-sm text-foreground">{transcript}</p>
          </div>
        )}

        {/* AI Response */}
        {aiResponse && (appState === "speaking" || appState === "thinking") && (
          <div className="w-full max-w-md rounded-lg border bg-secondary/50 p-4 animate-in fade-in duration-300">
            <p className="text-xs font-medium text-muted-foreground mb-1">AI Advisor:</p>
            <p className="text-sm text-foreground leading-relaxed">{aiResponse}</p>
          </div>
        )}

        {/* Reset during speaking */}
        {appState === "speaking" && (
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
          >
            Stop & Reset
          </button>
        )}

        {/* Conversation History */}
        {appState === "idle" && <ConversationHistory entries={conversations} />}

        {/* Debug Panel */}
        <DebugPanel
          micStatus={recStatus}
          recordingTime={recordingTime}
          audioSizeKB={audioSizeKB}
          micPermission={micPermission}
        />
      </main>
    </div>
  );
};

export default Index;
