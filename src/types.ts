export type EdgeAnimationStyle = 'laser' | 'pulse' | 'wave' | 'double-orbit' | 'corners';

export type FlashRhythm = 'classic' | 'continuous' | 'heartbeat' | 'sos' | 'strobe';

export interface EdgeLightingConfig {
  enabled: boolean;
  style: EdgeAnimationStyle;
  primaryColor: string;
  secondaryColor?: string;
  glowIntensity: number; // 1 to 5
  thickness: number; // 2 to 8 px
  speed: number; // in seconds (0.6 to 3)
}

export interface FlashConfig {
  cameraFlashEnabled: boolean;
  screenFlashEnabled: boolean;
  rhythm: FlashRhythm;
  repeatCount: number;
  screenFlashColor: string;
  vibrateEnabled: boolean;
  soundEnabled: boolean;
}

export interface NotificationAlert {
  id: string;
  type: 'call' | 'whatsapp' | 'sms' | 'alarm' | 'custom';
  title: string;
  sender: string;
  message: string;
  timestamp: string;
  accentColor: string;
  ringDurationSec?: number;
}

export interface PhoneBrandGuide {
  id: string;
  name: string;
  brandIcon: string;
  osName: string;
  steps: string[];
  tips: string[];
  hasEdgeLighting: boolean;
  edgeLightingSteps?: string[];
}

export interface BackgroundConfig {
  enabled: boolean;
  imageUrl: string;
  blur: number; // 0 to 20 px
  opacity: number; // 10 to 100%
  darkOverlay: number; // 0 to 95%
  applyToPhone: boolean;
}
