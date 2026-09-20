// Web Audio API Synthesizer for alerts and ringtones

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playNotificationTone(type: 'whatsapp' | 'sms' | 'alarm' | 'click' = 'whatsapp') {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'whatsapp') {
    // Two quick joyful chime tones (like WhatsApp default)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === 'sms') {
    // Elegant single soft marimba ping
    osc.type = 'sine';
    osc.frequency.setValueAtTime(830.61, now); // G#5
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.45);
  } else if (type === 'alarm') {
    // Pulsing urgent dual-beep
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(987.77, now); // B5
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.setValueAtTime(0.001, now + 0.1);
    gain.gain.setValueAtTime(0.3, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.4);
  } else {
    // Soft UI tick
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

// Synthesized Incoming Phone Ringtone loop controller
export class RingtoneController {
  private timer: number | null = null;
  private isPlaying = false;

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    const playCycle = () => {
      if (!this.isPlaying) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Ringtone phrase: 4 pleasant rising notes like modern mobile ringtones
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.25);
      });

      // Repeat ring after 2.2 seconds
      this.timer = window.setTimeout(playCycle, 2200);
    };

    playCycle();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export const ringtoneManager = new RingtoneController();
