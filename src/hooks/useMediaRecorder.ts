import { useState, useRef, useCallback, useEffect } from "react";

export type RecordingStatus = "idle" | "requesting" | "recording" | "stopped" | "error";

const SILENCE_TIMEOUT_MS = 2000;
const MAX_RECORDING_MS = 7000;
const SILENCE_THRESHOLD = 0.015;

export function useMediaRecorder() {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioSizeKB, setAudioSizeKB] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "pending">("pending");
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const maxTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isLockedRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(timerRef.current);
      clearTimeout(silenceTimerRef.current);
      clearTimeout(maxTimerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
    };
  }, []);

  const monitorAudioLevel = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);

    const tick = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      setAudioLevel(rms);

      // Silence detection
      if (rms < SILENCE_THRESHOLD) {
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            stopRecording();
          }, SILENCE_TIMEOUT_MS);
        }
      } else {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = undefined;
        }
      }

      if (mediaRecorderRef.current?.state === "recording") {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    tick();
  }, []);

  const startRecording = useCallback(async () => {
    if (isLockedRef.current) return;
    isLockedRef.current = true;
    setErrorMessage("");
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioSizeKB(0);
    setRecordingTime(0);
    setStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicPermission("granted");

      // Audio context for level monitoring
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      // MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setAudioSizeKB(parseFloat((blob.size / 1024).toFixed(2)));
        setStatus("stopped");
        // Cleanup
        stream.getTracks().forEach((t) => t.stop());
        audioCtx.close();
        cancelAnimationFrame(animFrameRef.current);
        clearInterval(timerRef.current);
        clearTimeout(silenceTimerRef.current);
        clearTimeout(maxTimerRef.current);
        silenceTimerRef.current = undefined;
        isLockedRef.current = false;
      };

      recorder.start(250);
      setStatus("recording");

      // Timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 500);

      // Max recording
      maxTimerRef.current = setTimeout(() => {
        stopRecording();
      }, MAX_RECORDING_MS);

      monitorAudioLevel();
    } catch (err: any) {
      setMicPermission("denied");
      setStatus("error");
      setErrorMessage(
        err?.name === "NotAllowedError"
          ? "Please allow microphone access to continue."
          : "Could not access the microphone. Please check your device settings."
      );
      isLockedRef.current = false;
    }
  }, [monitorAudioLevel]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioSizeKB(0);
    setRecordingTime(0);
    setStatus("idle");
    setAudioLevel(0);
    setErrorMessage("");
  }, [audioUrl]);

  return {
    status,
    audioBlob,
    audioUrl,
    audioSizeKB,
    recordingTime,
    micPermission,
    audioLevel,
    errorMessage,
    startRecording,
    stopRecording,
    reset,
  };
}
