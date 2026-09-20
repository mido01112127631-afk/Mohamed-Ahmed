// Physical device flashlight / torch manager using MediaStreamTrack ImageCapture/applyConstraints

export interface TorchStatus {
  supported: boolean;
  active: boolean;
  error?: string;
  hasPermission?: boolean;
}

class TorchController {
  private stream: MediaStream | null = null;
  private track: MediaStreamTrack | null = null;
  private isTorchOn = false;
  private strobeTimer: number | null = null;

  async isSupported(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }
    return true;
  }

  async acquireTorch(): Promise<boolean> {
    try {
      if (this.track && this.track.readyState === 'live') {
        return true;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }
        }
      });

      this.stream = stream;
      const track = stream.getVideoTracks()[0];
      if (!track) return false;

      this.track = track;

      // Check capabilities
      const capabilities = (track.getCapabilities && (track.getCapabilities() as Record<string, unknown>)) || {};
      if ('torch' in capabilities) {
        return true;
      }
      return true; // Still allow trying applyConstraints
    } catch {
      return false;
    }
  }

  async setTorch(on: boolean): Promise<boolean> {
    try {
      const ready = await this.acquireTorch();
      if (!ready || !this.track) return false;

      // Type cast for torch constraint
      const constraints = {
        advanced: [{ torch: on }]
      } as unknown as MediaTrackConstraints;

      await this.track.applyConstraints(constraints);
      this.isTorchOn = on;
      return true;
    } catch {
      this.isTorchOn = false;
      return false;
    }
  }

  async toggle(): Promise<boolean> {
    return this.setTorch(!this.isTorchOn);
  }

  get isOn(): boolean {
    return this.isTorchOn;
  }

  // Strobe pattern for physical flashlight (e.g. blink 3 times or continuous)
  triggerStrobe(count = 3, intervalMs = 150) {
    this.stopStrobe();
    let counter = 0;
    const maxTicks = count * 2;

    this.strobeTimer = window.setInterval(async () => {
      counter++;
      const shouldTurnOn = counter % 2 !== 0;
      await this.setTorch(shouldTurnOn);

      if (counter >= maxTicks) {
        this.stopStrobe();
        await this.setTorch(false);
      }
    }, intervalMs);
  }

  stopStrobe() {
    if (this.strobeTimer) {
      clearInterval(this.strobeTimer);
      this.strobeTimer = null;
    }
  }

  release() {
    this.stopStrobe();
    if (this.isTorchOn) {
      this.setTorch(false).catch(() => {});
    }
    if (this.track) {
      this.track.stop();
      this.track = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    this.isTorchOn = false;
  }
}

export const torchController = new TorchController();
