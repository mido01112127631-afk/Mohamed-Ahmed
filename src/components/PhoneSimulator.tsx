import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  Bell, 
  Zap, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Flame,
  ShieldCheck
} from 'lucide-react';
import { EdgeLightingConfig, FlashConfig, NotificationAlert } from '../types';

interface PhoneSimulatorProps {
  activeAlert: NotificationAlert | null;
  onDismissAlert: () => void;
  edgeConfig: EdgeLightingConfig;
  flashConfig: FlashConfig;
  isFlashing: boolean;
  onTriggerTestCall: () => void;
  onTriggerTestWhatsApp: () => void;
  wallpaperUrl?: string;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  activeAlert,
  onDismissAlert,
  edgeConfig,
  flashConfig,
  isFlashing,
  onTriggerTestCall,
  onTriggerTestWhatsApp,
  wallpaperUrl
}) => {
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');
  const [currentTime] = useState(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  return (
    <div className="flex flex-col items-center">
      {/* View Toggle Bar */}
      <div className="mb-4 flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-full border border-slate-800 shadow-inner">
        <button
          id="btn-view-front"
          onClick={() => setViewSide('front')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
            viewSide === 'front'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current"></span>
          الشاشة الأمامية (إضاءة الحواف)
        </button>
        <button
          id="btn-view-back"
          onClick={() => setViewSide('back')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
            viewSide === 'back'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          الجهة الخلفية (فلاش LED)
        </button>
      </div>

      {/* Phone Hardware Container */}
      <div className="relative">
        {/* Ambient Room Glow from Phone / Flash */}
        <AnimatePresence>
          {isFlashing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.3, 0.8, 0.4], scale: [1, 1.1, 1] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              className="absolute -inset-10 rounded-[60px] blur-3xl pointer-events-none -z-10"
              style={{
                backgroundColor: viewSide === 'back' ? 'rgba(255, 255, 230, 0.5)' : edgeConfig.primaryColor
              }}
            />
          )}
        </AnimatePresence>

        {/* Physical Phone Frame */}
        <div 
          id="phone-device-frame"
          className="relative w-[300px] sm:w-[330px] h-[610px] sm:h-[640px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-[6px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col justify-between overflow-hidden"
        >
          {/* Side Hardware Buttons */}
          <div className="absolute -left-[9px] top-28 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
          <div className="absolute -left-[9px] top-44 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
          <div className="absolute -right-[9px] top-32 w-[3px] h-16 bg-slate-700 rounded-r-sm" />

          {/* FRONT VIEW */}
          {viewSide === 'front' ? (
            <div className="relative w-full h-full bg-slate-950 rounded-[40px] overflow-hidden flex flex-col justify-between select-none">
              
              {/* Phone Screen Wallpaper Image */}
              {wallpaperUrl && (
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  <img
                    src={wallpaperUrl}
                    alt="خلفية شاشة الهاتف"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/45 backdrop-brightness-90" />
                </div>
              )}
              
              {/* Dynamic Island / Punch Hole */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 bg-black px-4 py-1 rounded-full flex items-center gap-2 border border-slate-800/80 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
                <div className="w-2 h-2 rounded-full bg-blue-950 ring-1 ring-blue-900/50" />
                {isFlashing && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>

              {/* Status Bar */}
              <div className="pt-3 px-6 flex justify-between items-center text-[11px] text-slate-400 font-medium z-30">
                <span>{currentTime}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <div className="w-4 h-2 border border-slate-400 rounded-xs p-0.5 flex items-center">
                    <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* EDGE LIGHTING SYSTEM OVERLAY */}
              {edgeConfig.enabled && isFlashing && (
                <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-[40px]">
                  {/* Style: Laser Traveling Border */}
                  {edgeConfig.style === 'laser' && (
                    <div
                      className="absolute inset-0 rounded-[40px] border-solid"
                      style={{
                        borderWidth: `${edgeConfig.thickness}px`,
                        borderColor: edgeConfig.primaryColor,
                        filter: `drop-shadow(0 0 ${edgeConfig.glowIntensity * 4}px ${edgeConfig.primaryColor})`,
                        animation: `spin ${edgeConfig.speed}s linear infinite`
                      }}
                    />
                  )}

                  {/* Style: Pulsing Glow */}
                  {edgeConfig.style === 'pulse' && (
                    <motion.div
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        boxShadow: [
                          `inset 0 0 ${edgeConfig.glowIntensity * 4}px ${edgeConfig.primaryColor}`,
                          `inset 0 0 ${edgeConfig.glowIntensity * 12}px ${edgeConfig.primaryColor}, 0 0 ${edgeConfig.glowIntensity * 10}px ${edgeConfig.primaryColor}`,
                          `inset 0 0 ${edgeConfig.glowIntensity * 4}px ${edgeConfig.primaryColor}`
                        ]
                      }}
                      transition={{ repeat: Infinity, duration: edgeConfig.speed }}
                      className="absolute inset-0 rounded-[40px] border"
                      style={{
                        borderColor: edgeConfig.primaryColor,
                        borderWidth: `${edgeConfig.thickness}px`
                      }}
                    />
                  )}

                  {/* Style: Wave / Double Orbit */}
                  {(edgeConfig.style === 'wave' || edgeConfig.style === 'double-orbit') && (
                    <div
                      className="absolute inset-0 rounded-[40px]"
                      style={{
                        boxShadow: `inset 0 0 ${edgeConfig.glowIntensity * 8}px ${edgeConfig.primaryColor}, 0 0 ${edgeConfig.glowIntensity * 12}px ${edgeConfig.secondaryColor || edgeConfig.primaryColor}`,
                        border: `${edgeConfig.thickness}px solid ${edgeConfig.primaryColor}`,
                        animation: 'pulse 0.8s ease-in-out infinite alternate'
                      }}
                    />
                  )}

                  {/* Style: Glowing Corners */}
                  {edgeConfig.style === 'corners' && (
                    <div className="absolute inset-0 rounded-[40px] p-2">
                      <div 
                        className="w-10 h-10 border-t-4 border-r-4 rounded-tr-3xl absolute top-2 right-2 animate-pulse"
                        style={{ borderColor: edgeConfig.primaryColor, filter: `drop-shadow(0 0 8px ${edgeConfig.primaryColor})` }}
                      />
                      <div 
                        className="w-10 h-10 border-t-4 border-l-4 rounded-tl-3xl absolute top-2 left-2 animate-pulse"
                        style={{ borderColor: edgeConfig.primaryColor, filter: `drop-shadow(0 0 8px ${edgeConfig.primaryColor})` }}
                      />
                      <div 
                        className="w-10 h-10 border-b-4 border-r-4 rounded-br-3xl absolute bottom-2 right-2 animate-pulse"
                        style={{ borderColor: edgeConfig.primaryColor, filter: `drop-shadow(0 0 8px ${edgeConfig.primaryColor})` }}
                      />
                      <div 
                        className="w-10 h-10 border-b-4 border-l-4 rounded-bl-3xl absolute bottom-2 left-2 animate-pulse"
                        style={{ borderColor: edgeConfig.primaryColor, filter: `drop-shadow(0 0 8px ${edgeConfig.primaryColor})` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN FLASH STROBE EFFECT (Full screen color wash) */}
              {flashConfig.screenFlashEnabled && isFlashing && (
                <motion.div
                  animate={{ opacity: [0, 0.85, 0] }}
                  transition={{ repeat: Infinity, duration: 0.28 }}
                  className="absolute inset-0 z-20 pointer-events-none rounded-[40px]"
                  style={{ backgroundColor: flashConfig.screenFlashColor }}
                />
              )}

              {/* SCREEN CONTENT */}
              <div className="relative z-10 flex-1 px-4 py-6 flex flex-col justify-between">
                {/* Wallpaper & Clock */}
                <div className="text-center pt-8">
                  <h1 className="text-5xl font-bold tracking-tight text-white font-mono drop-shadow">
                    {currentTime}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 font-medium">السبت، 19 سبتمبر</p>
                </div>

                {/* ACTIVE NOTIFICATION OR CALL CARD */}
                <div className="my-auto">
                  <AnimatePresence mode="wait">
                    {activeAlert ? (
                      <motion.div
                        key={activeAlert.id}
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="rounded-2xl p-4 shadow-xl border backdrop-blur-md relative overflow-hidden"
                        style={{
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          borderColor: activeAlert.accentColor
                        }}
                      >
                        {/* Glow top highlight */}
                        <div 
                          className="absolute top-0 inset-x-0 h-1"
                          style={{ backgroundColor: activeAlert.accentColor }}
                        />

                        {activeAlert.type === 'call' ? (
                          /* Incoming Call Interface */
                          <div className="text-center py-2">
                            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg ring-4 ring-amber-500/30 animate-pulse">
                              {activeAlert.sender[0]}
                            </div>
                            <h3 className="text-white font-bold text-lg mt-2">{activeAlert.sender}</h3>
                            <p className="text-xs text-amber-300 font-medium animate-pulse">مكالمة واردة... فلاش منبثق ⚡</p>
                            
                            <div className="flex justify-center gap-6 mt-4">
                              <button
                                id="btn-call-decline"
                                onClick={onDismissAlert}
                                className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
                                title="إنهاء المكالمة"
                              >
                                <PhoneOff className="w-5 h-5" />
                              </button>
                              <button
                                id="btn-call-accept"
                                onClick={onDismissAlert}
                                className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 animate-bounce"
                                title="الرد على المكالمة"
                              >
                                <Phone className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Standard / WhatsApp Notification */
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-6 h-6 rounded-md flex items-center justify-center text-slate-950"
                                  style={{ backgroundColor: activeAlert.accentColor }}
                                >
                                  {activeAlert.type === 'whatsapp' ? (
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  ) : (
                                    <Bell className="w-3.5 h-3.5" />
                                  )}
                                </div>
                                <span className="text-xs font-semibold text-white">
                                  {activeAlert.title}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">الآن</span>
                            </div>

                            <p className="text-sm font-medium text-slate-200">{activeAlert.sender}</p>
                            <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{activeAlert.message}</p>

                            <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
                              <button
                                id="btn-dismiss-alert"
                                onClick={onDismissAlert}
                                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800/80 transition-colors"
                              >
                                مسح التنبيه
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      /* Idle State when no alert */
                      <div className="text-center py-6 px-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                          <Zap className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-200">
                          نظام الإشعارات المضيئة جاهز
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          اضغط على أزرار التجربة أدناه لمشاهدة إضاءة الحواف والفلاش
                        </p>
                        <div className="mt-3 flex justify-center gap-2">
                          <button
                            id="btn-quick-call-preview"
                            onClick={onTriggerTestCall}
                            className="text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            مكالمة
                          </button>
                          <button
                            id="btn-quick-whatsapp-preview"
                            onClick={onTriggerTestWhatsApp}
                            className="text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            واتساب
                          </button>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom App Dock */}
                <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl p-2.5 flex justify-around items-center border border-slate-800/70">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* Home Indicator Bar */}
                <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
              </div>
            </div>
          ) : (
            /* BACK VIEW (Backplate with camera and Flash LED) */
            <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-[40px] overflow-hidden flex flex-col justify-between p-6 select-none border border-slate-800">
              
              {/* Back Camera Island Module */}
              <div className="w-28 bg-slate-900/90 rounded-3xl p-3 border border-slate-700/80 shadow-2xl backdrop-blur-md">
                <div className="grid grid-cols-2 gap-2.5 items-center">
                  {/* Camera Lens 1 */}
                  <div className="w-9 h-9 rounded-full bg-black border-2 border-slate-700 flex items-center justify-center shadow-inner">
                    <div className="w-4 h-4 rounded-full bg-indigo-950 ring-1 ring-indigo-500/40" />
                  </div>
                  {/* Camera Lens 2 */}
                  <div className="w-9 h-9 rounded-full bg-black border-2 border-slate-700 flex items-center justify-center shadow-inner">
                    <div className="w-4 h-4 rounded-full bg-cyan-950 ring-1 ring-cyan-500/40" />
                  </div>

                  {/* Ultra Flash LED Component */}
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-75 ${
                        isFlashing
                          ? 'bg-amber-100 ring-8 ring-amber-300/80 shadow-[0_0_50px_20px_rgba(255,245,180,0.9)]'
                          : 'bg-amber-950/40 border border-amber-500/30'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full ${isFlashing ? 'bg-white' : 'bg-amber-500/50'}`} />
                    </div>

                    {/* Lens Strobe Flare Rays */}
                    {isFlashing && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-90 animate-pulse" />
                        <div className="h-48 w-1 bg-gradient-to-b from-transparent via-white to-transparent opacity-90 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Microphone hole */}
                  <div className="w-2 h-2 rounded-full bg-slate-800 mx-auto" />
                </div>
              </div>

              {/* Phone Brand Emblem */}
              <div className="text-center my-auto opacity-20">
                <Flame className="w-12 h-12 mx-auto text-slate-400" />
                <span className="text-xs tracking-widest uppercase font-mono mt-2 block">
                  FLASH ALERT PRO
                </span>
              </div>

              {/* Status Note on Backplate */}
              <div className="text-center bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <p className="text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5">
                  <Zap className={`w-3.5 h-3.5 ${isFlashing ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
                  حالة وميض فلاش الكاميرا
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isFlashing ? '⚡ الفلاش الخلفي يومض حالياً' : 'جاهز للوميض عند استقبال الإشعار'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
