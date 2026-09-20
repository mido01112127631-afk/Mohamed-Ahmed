import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Zap, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  MessageCircle,
  Minimize2
} from 'lucide-react';
import { EdgeLightingConfig, FlashConfig, NotificationAlert } from '../types';

interface FullScreenAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  edgeConfig: EdgeLightingConfig;
  flashConfig: FlashConfig;
  activeAlert: NotificationAlert | null;
  onTriggerCall: () => void;
  onTriggerWhatsApp: () => void;
  onDismissAlert: () => void;
  isFlashing: boolean;
  onToggleStrobe: () => void;
}

export const FullScreenAlertModal: React.FC<FullScreenAlertModalProps> = ({
  isOpen,
  onClose,
  edgeConfig,
  flashConfig,
  activeAlert,
  onTriggerCall,
  onTriggerWhatsApp,
  onDismissAlert,
  isFlashing,
  onToggleStrobe
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      id="fullscreen-alert-overlay"
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* FULLSCREEN EDGE LIGHTING BORDER */}
      {edgeConfig.enabled && (
        <div 
          className="fixed inset-0 pointer-events-none z-20"
          style={{
            boxShadow: `inset 0 0 ${edgeConfig.glowIntensity * 16}px ${edgeConfig.primaryColor}, 0 0 ${edgeConfig.glowIntensity * 20}px ${edgeConfig.primaryColor}`,
            border: `${edgeConfig.thickness * 1.5}px solid ${edgeConfig.primaryColor}`,
            animation: isFlashing ? 'pulse 0.4s ease-in-out infinite alternate' : 'none',
            opacity: isFlashing ? 1 : 0.4
          }}
        />
      )}

      {/* FULLSCREEN COLOR FLASH STROBE */}
      {flashConfig.screenFlashEnabled && isFlashing && (
        <motion.div
          animate={{ opacity: [0, 0.75, 0] }}
          transition={{ repeat: Infinity, duration: 0.25 }}
          className="fixed inset-0 pointer-events-none z-10"
          style={{ backgroundColor: flashConfig.screenFlashColor }}
        />
      )}

      {/* Top Header */}
      <div className="relative z-30 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-3.5 h-3.5 rounded-full animate-ping"
            style={{ backgroundColor: edgeConfig.primaryColor }}
          />
          <h2 className="text-lg font-bold text-white tracking-wide">
            وضع الإضاءة الشاملة للشاشة (Full Screen Alert Beacon)
          </h2>
        </div>

        <button
          id="btn-close-fullscreen"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-all shadow-lg active:scale-95"
          title="إغلاق الشاشة الكاملة (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Alert Notification Display */}
      <div className="relative z-30 flex flex-col items-center justify-center max-w-xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          {activeAlert ? (
            <motion.div
              key={activeAlert.id}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full bg-slate-900/90 border-2 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
              style={{ borderColor: activeAlert.accentColor }}
            >
              <div 
                className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-slate-950 font-bold text-3xl shadow-xl mb-4 animate-bounce"
                style={{ backgroundColor: activeAlert.accentColor }}
              >
                {activeAlert.type === 'call' ? <PhoneCall className="w-10 h-10" /> : <MessageCircle className="w-10 h-10" />}
              </div>

              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                {activeAlert.type === 'call' ? 'مكالمة هاتفية واردة' : activeAlert.title}
              </span>

              <h3 className="text-3xl font-extrabold text-white mt-1">
                {activeAlert.sender}
              </h3>

              <p className="text-base text-slate-300 mt-2 max-w-md mx-auto">
                {activeAlert.message}
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  id="btn-fullscreen-dismiss"
                  onClick={onDismissAlert}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl transition-transform active:scale-95"
                >
                  إنهاء وتجاهل
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div 
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-2xl animate-pulse"
                style={{
                  backgroundColor: `${edgeConfig.primaryColor}20`,
                  border: `2px solid ${edgeConfig.primaryColor}`
                }}
              >
                <Zap className="w-9 h-9" style={{ color: edgeConfig.primaryColor }} />
              </div>
              <h3 className="text-2xl font-bold text-white">
                الشاشة جاهزة للوميض عند استقبال أي إشعار
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                ضع الهاتف أو الشاشة بجوارك في الغرفة. عند وصول أي تنبيه، ستضيء الحواف بالكامل لتلفت انتباهك بدون إزعاج.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-30 p-6 flex flex-wrap items-center justify-center gap-3 bg-slate-950/80 backdrop-blur-md border-t border-slate-900">
        <button
          id="btn-fullscreen-test-call"
          onClick={onTriggerCall}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95"
        >
          <PhoneCall className="w-4 h-4" />
          تجربة رنين ومكالمة
        </button>

        <button
          id="btn-fullscreen-test-whatsapp"
          onClick={onTriggerWhatsApp}
          className="px-5 py-2.5 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          تجربة واتساب مضيء
        </button>

        <button
          id="btn-fullscreen-toggle-strobe"
          onClick={onToggleStrobe}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95 ${
            isFlashing ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/30' : 'bg-slate-800 text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          {isFlashing ? 'إيقاف الوميض' : 'تشغيل وميض تجريبي'}
        </button>

        <button
          id="btn-fullscreen-exit-bottom"
          onClick={onClose}
          className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2"
        >
          <Minimize2 className="w-4 h-4" />
          العودة للمحاكي
        </button>
      </div>
    </div>
  );
};
