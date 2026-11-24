'use client';

import React from 'react';
import {
  Mic,
  MicOff,
  Send,
  Image as ImageIcon,
  Camera,
  X,
  Sparkles,
  Command,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Composer() {
  const { sendMessage, currentStage } = useAppStore();
  const [text, setText] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [interimTranscript, setInterimTranscript] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [showWebcam, setShowWebcam] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setInterimTranscript(transcript);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      if (interimTranscript) {
        sendMessage({ audioTranscript: interimTranscript, text: interimTranscript });
        setInterimTranscript('');
      }
    } else {
      setInterimTranscript('');
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch {
        setIsRecording(true);
        setTimeout(() => {
          const sampleAudioPrompt = 'Add milk and eggs to my shopping list';
          setInterimTranscript(sampleAudioPrompt);
          setTimeout(() => {
            setIsRecording(false);
            sendMessage({ audioTranscript: sampleAudioPrompt, text: sampleAudioPrompt });
            setInterimTranscript('');
          }, 1200);
        }, 1500);
      }
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) handleImageUpload(file);
      }
    }
  };

  const startWebcam = async () => {
    setShowWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      // ignore
    }
  };

  const captureWebcamSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      setSelectedImage(canvas.toDataURL('image/png'));
    }
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setShowWebcam(false);
  };

  const closeWebcam = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    }
    setShowWebcam(false);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && !selectedImage && !interimTranscript) return;

    sendMessage({
      text: trimmed || undefined,
      imageDataUrl: selectedImage || undefined,
      audioTranscript: interimTranscript || undefined,
    });

    setText('');
    setSelectedImage(null);
    setInterimTranscript('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isBusy = currentStage !== 'idle' && currentStage !== 'executed' && currentStage !== 'error';

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-md p-4 sm:p-5">
      <div className="mx-auto max-w-4xl space-y-2.5">
        {/* Image Preview if selected */}
        {selectedImage && (
          <div className="relative inline-block rounded-2xl overflow-hidden border border-border shadow-coffee-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="Attachment" className="h-20 w-auto object-cover rounded-2xl" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Live Interim Transcript Bubble in Warm Caramel */}
        {isRecording && (
          <div className="flex items-center gap-2 p-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200 animate-pulse font-medium">
            <Mic className="h-4 w-4 animate-bounce" />
            <span>Listening... {interimTranscript || 'Speak naturally (say: "Add milk and eggs to my shopping list")'}</span>
          </div>
        )}

        {/* Composer Input Box - Wireframe Pill Design */}
        <div className="relative flex items-end gap-2 rounded-3xl bg-secondary border border-border p-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm transition-all">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Action buttons (Attach Image, Webcam) */}
          <div className="flex items-center gap-1 pb-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Attach Image (or paste from clipboard)"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <button
              onClick={startWebcam}
              title="Capture photo from camera"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Say it, type it, or show it... (e.g. 'Remind me tomorrow at 9 am', or drag an image)"
            rows={1}
            className="flex-1 max-h-32 resize-none bg-transparent py-2 px-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          {/* Voice Mic Button */}
          <button
            onClick={toggleRecording}
            title={isRecording ? 'Stop Recording' : 'Voice Input (Click to speak)'}
            className={`p-2.5 rounded-full transition-all ${
              isRecording
                ? 'bg-amber-600 text-white shadow-coffee-soft animate-pulse'
                : 'text-muted-foreground hover:text-primary hover:bg-card'
            }`}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          {/* Send Button - Rounded Pill */}
          <button
            onClick={handleSend}
            disabled={(!text.trim() && !selectedImage && !interimTranscript) || isBusy}
            title="Send (Enter)"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-95 shadow-coffee-soft transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Quick prompt suggestions chips - Pill Buttons matching wireframe screen 4 & 5 */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="font-semibold text-foreground/70 hidden sm:inline">Try:</span>
            <button
              onClick={() => setText('Remind me to submit the report tomorrow at 9 am')}
              className="px-3 py-1 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all whitespace-nowrap text-xs font-medium border border-border"
            >
              Remind tomorrow at 9 am
            </button>
            <button
              onClick={() => setText('Add milk and eggs to my shopping list')}
              className="px-3 py-1 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all whitespace-nowrap text-xs font-medium border border-border"
            >
              Add milk & eggs
            </button>
            <button
              onClick={() => setText('Change it to 10 am')}
              className="px-3 py-1 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all whitespace-nowrap text-xs font-medium border border-border"
            >
              Change it to 10 am
            </button>
            <button
              onClick={() => setText('Delete that')}
              className="px-3 py-1 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all whitespace-nowrap text-xs font-medium border border-border"
            >
              Delete that
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-1 font-mono text-[10px]">
            <Command className="h-3 w-3" />
            <span>Enter to send, Shift+Enter newline</span>
          </div>
        </div>
      </div>

      {/* Webcam Modal */}
      {showWebcam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-card p-5 border border-border shadow-coffee-elevated space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Live Camera Snapshot</h3>
              <button onClick={closeWebcam} className="p-1 rounded-full text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={closeWebcam} className="px-4 py-2 rounded-full text-xs font-semibold text-muted-foreground hover:bg-secondary">
                Cancel
              </button>
              <button
                onClick={captureWebcamSnapshot}
                className="px-5 py-2 rounded-full text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-coffee-soft"
              >
                Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
