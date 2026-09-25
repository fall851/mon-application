export interface RecordOptions {
  canvas: HTMLCanvasElement;
  audioStream: MediaStream | null;
  duration: number; // in seconds
  onProgress?: (progressFraction: number, remainingSeconds: number) => void;
  onFinish?: (blob: Blob, url: string) => void;
  onError?: (err: Error) => void;
}

export class BrowserVideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;
  private timer: number | null = null;
  private startTime = 0;

  public static getBestMimeType(): string {
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4;codecs=avc1,mp4a',
      'video/mp4',
    ];

    for (const type of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return 'video/webm';
  }

  public startRecording(options: RecordOptions): Promise<{ blob: Blob; url: string }> {
    return new Promise((resolve, reject) => {
      try {
        const { canvas, audioStream, duration, onProgress, onFinish, onError } = options;
        this.recordedChunks = [];

        // 1. Capture 30 FPS stream from canvas
        const canvasStream = canvas.captureStream ? canvas.captureStream(30) : (canvas as unknown as { mozCaptureStream: (fps: number) => MediaStream }).mozCaptureStream(30);

        // 2. Combine with audio if available
        const tracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];
        if (audioStream && audioStream.getAudioTracks().length > 0) {
          tracks.push(audioStream.getAudioTracks()[0]);
        }

        const combinedStream = new MediaStream(tracks);
        const mimeType = BrowserVideoRecorder.getBestMimeType();

        this.mediaRecorder = new MediaRecorder(combinedStream, {
          mimeType,
          videoBitsPerSecond: 2500000, // 2.5 Mbps crisp quality
        });

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.recordedChunks.push(e.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = null;
          }
          this.isRecording = false;

          const blob = new Blob(this.recordedChunks, { type: mimeType });
          const url = URL.createObjectURL(blob);

          if (onFinish) onFinish(blob, url);
          resolve({ blob, url });
        };

        this.mediaRecorder.onerror = (e) => {
          const err = new Error('MediaRecorder error: ' + String(e));
          if (onError) onError(err);
          reject(err);
        };

        // Start
        this.isRecording = true;
        this.startTime = Date.now();
        this.mediaRecorder.start(200); // 200ms slices

        // Progress timer
        this.timer = window.setInterval(() => {
          const elapsedSec = (Date.now() - this.startTime) / 1000;
          const fraction = Math.min(1, elapsedSec / duration);
          const remaining = Math.max(0, Math.ceil(duration - elapsedSec));

          if (onProgress) onProgress(fraction, remaining);

          if (elapsedSec >= duration) {
            this.stopRecording();
          }
        }, 200);
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (options.onError) options.onError(error);
        reject(error);
      }
    });
  }

  public stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    }
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}
