import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Smartphone, 
  Sparkles, 
  BookOpen, 
  History, 
  Flashlight, 
  Maximize2, 
  Volume2, 
  CheckCircle, 
  Info,
  ShieldAlert,
  Bell,
  Image as ImageIcon
} from 'lucide-react';
import { 
  EdgeLightingConfig, 
  FlashConfig, 
  NotificationAlert, 
  FlashRhythm,
  BackgroundConfig
} from './types';
import { playNotificationTone, ringtoneManager } from './utils/audio';
import { torchController } from './utils/torch';
import { PhoneSimulator } from './components/PhoneSimulator';
import { FlashControls } from './components/FlashControls';
import { EdgeSettings } from './components/EdgeSettings';
import { PhoneGuides } from './components/PhoneGuides';
import { FullScreenAlertModal } from './components/FullScreenAlertModal';
import { BackgroundSettingsModal } from './components/BackgroundSettingsModal';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'simulator' | 'edge' | 'guides' | 'history'>('simulator');

  // Edge Lighting Configuration
  const [edgeConfig, setEdgeConfig] = useState<EdgeLightingConfig>({
    enabled: true,
    style: 'pulse',
    primaryColor: '#00f0ff',
    secondaryColor: '#a855f7',
    glowIntensity: 3,
    thickness: 4,
    speed: 1.2
  });

  // Flash Configuration
  const [flashConfig, setFlashConfig] = useState<FlashConfig>({
    cameraFlashEnabled: true,
    screenFlashEnabled: true,
    rhythm: 'classic',
    repeatCount: 3,
    screenFlashColor: '#ffffff',
    vibrateEnabled: true,
    soundEnabled: true
  });

  // Runtime State
  const [activeAlert, setActiveAlert] = useState<NotificationAlert | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [realTorchActive, setRealTorchActive] = useState<boolean>(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [alertHistory, setAlertHistory] = useState<NotificationAlert[]>([
    {
      id: 'init-1',
      type: 'whatsapp',
      title: 'واتساب',
      sender: 'سارة خالد',
      message: 'السلام عليكم، هل جربت ميزة إضاءة الحواف الجديدة؟ رهيبة جداً!',
      timestamp: 'منذ 5 دقائق',
      accentColor: '#22c55e'
    },
    {
      id: 'init-2',
      type: 'call',
      title: 'مكالمة واردة',
      sender: 'أحمد علي',
      message: 'مكالمة هاتفية فائتة',
      timestamp: 'منذ 15 دقيقة',
      accentColor: '#f59e0b'
    }
  ]);

  const flashIntervalRef = useRef<number | null>(null);
  const flashTimeoutRef = useRef<number | null>(null);

  // Background Image Configuration
  const DEFAULT_BG_IMAGE = '/background.jpg';
  const [bgConfig, setBgConfig] = useState<BackgroundConfig>(() => {
    try {
      const saved = localStorage.getItem('app_bg_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {
      enabled: true,
      imageUrl: DEFAULT_BG_IMAGE,
      blur: 4,
      opacity: 85,
      darkOverlay: 60,
      applyToPhone: true
    };
  });
  const [isBgModalOpen, setIsBgModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('app_bg_config', JSON.stringify(bgConfig));
    } catch {}
  }, [bgConfig]);

  // Show brief toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Trigger flash rhythm effect on screen and device
  const triggerFlashSequence = (rhythm: FlashRhythm, durationMs = 3000) => {
    // Clear any existing flash cycle
    if (flashIntervalRef.current) clearInterval(flashIntervalRef.current);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);

    setIsFlashing(true);

    // Physical Torch Strobe if enabled
    if (flashConfig.cameraFlashEnabled) {
      const strobeCount = rhythm === 'classic' ? 3 : rhythm === 'heartbeat' ? 4 : 8;
      torchController.triggerStrobe(strobeCount, rhythm === 'strobe' ? 80 : 150);
    }

    // Vibration feedback
    if (flashConfig.vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      if (rhythm === 'classic') {
        navigator.vibrate([200, 100, 200, 100, 200]);
      } else if (rhythm === 'heartbeat') {
        navigator.vibrate([150, 80, 250, 400, 150, 80, 250]);
      } else {
        navigator.vibrate([300, 150, 300, 150, 300]);
      }
    }

    // Auto-stop after duration unless continuous call
    if (rhythm !== 'continuous') {
      flashTimeoutRef.current = window.setTimeout(() => {
        setIsFlashing(false);
      }, durationMs);
    }
  };

  // Stop active alert and flash
  const handleDismissAlert = () => {
    setActiveAlert(null);
    setIsFlashing(false);
    ringtoneManager.stop();
    torchController.stopStrobe();
    if (flashIntervalRef.current) clearInterval(flashIntervalRef.current);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      ringtoneManager.stop();
      torchController.release();
      if (flashIntervalRef.current) clearInterval(flashIntervalRef.current);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  // Preset Alert Handlers
  const handleTriggerCall = () => {
    handleDismissAlert();
    const callAlert: NotificationAlert = {
      id: `call-${Date.now()}`,
      type: 'call',
      title: 'مكالمة واردة',
      sender: 'د. محمد مصطفى',
      message: 'يتصل بك الآن... الوميض شغال باستمرار',
      timestamp: 'الآن',
      accentColor: '#f59e0b',
      ringDurationSec: 25
    };

    setActiveAlert(callAlert);
    setAlertHistory((prev) => [callAlert, ...prev.slice(0, 19)]);
    triggerFlashSequence('continuous');

    if (flashConfig.soundEnabled) {
      ringtoneManager.start();
    }
    showToast('📞 مكالمة واردة! الفلاش والحواف تضيء برنين متواصل');
  };

  const handleTriggerWhatsApp = () => {
    handleDismissAlert();
    const waAlert: NotificationAlert = {
      id: `wa-${Date.now()}`,
      type: 'whatsapp',
      title: 'واتساب',
      sender: 'مجموعة العمل والمشاريع',
      message: 'تم إرسال الملف المعتمد لمشروعك، يرجى المراجعة فوراً.',
      timestamp: 'الآن',
      accentColor: '#22c55e'
    };

    setActiveAlert(waAlert);
    setAlertHistory((prev) => [waAlert, ...prev.slice(0, 19)]);
    triggerFlashSequence(flashConfig.rhythm, 3200);

    if (flashConfig.soundEnabled) {
      playNotificationTone('whatsapp');
    }
    showToast('💬 إشعار واتساب! ومض الفلاش باللون الأخضر المميز');
  };

  const handleTriggerSMS = () => {
    handleDismissAlert();
    const smsAlert: NotificationAlert = {
      id: `sms-${Date.now()}`,
      type: 'sms',
      title: 'رسائل SMS',
      sender: 'البنك الأهلي',
      message: 'رمز التحقق السري OTP الخاص بك هو: [ 489201 ]. لا تشاركه مع أحد.',
      timestamp: 'الآن',
      accentColor: '#06b6d4'
    };

    setActiveAlert(smsAlert);
    setAlertHistory((prev) => [smsAlert, ...prev.slice(0, 19)]);
    triggerFlashSequence(flashConfig.rhythm, 2500);

    if (flashConfig.soundEnabled) {
      playNotificationTone('sms');
    }
    showToast('📩 رسالة نصية قصيرة! تم تشغيل الوميض وحواف الشاشة');
  };

  const handleTriggerAlarm = () => {
    handleDismissAlert();
    const alarmAlert: NotificationAlert = {
      id: `alarm-${Date.now()}`,
      type: 'alarm',
      title: 'منبه الصباح',
      sender: 'منبه الاستيقاظ والعمل',
      message: 'حان موعد الاستيقاظ! وميض قوي ومكثف لإضاءة الغرفة.',
      timestamp: 'الآن',
      accentColor: '#ef4444'
    };

    setActiveAlert(alarmAlert);
    setAlertHistory((prev) => [alarmAlert, ...prev.slice(0, 19)]);
    triggerFlashSequence('strobe', 4500);

    if (flashConfig.soundEnabled) {
      playNotificationTone('alarm');
    }
    showToast('⏰ تنبيه منبه! ستروب سريع وإضاءة قوية');
  };

  const handleTriggerCustom = (sender: string, message: string) => {
    handleDismissAlert();
    const customAlert: NotificationAlert = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      title: 'تنبيه مخصص',
      sender,
      message,
      timestamp: 'الآن',
      accentColor: edgeConfig.primaryColor
    };

    setActiveAlert(customAlert);
    setAlertHistory((prev) => [customAlert, ...prev.slice(0, 19)]);
    triggerFlashSequence(flashConfig.rhythm, 3000);

    if (flashConfig.soundEnabled) {
      playNotificationTone('whatsapp');
    }
    showToast(`✨ إشعار من "${sender}" مع وميض فلاش مخصص!`);
  };

  // Real physical torch toggle
  const handleToggleRealTorch = async () => {
    try {
      const nextState = !realTorchActive;
      const success = await torchController.setTorch(nextState);
      if (success) {
        setRealTorchActive(nextState);
        showToast(nextState ? '⚡ تم تشغيل كشاف الفلاش الحقيقي على هاتفك!' : 'تم إطفاء كشاف الهاتف.');
      } else {
        showToast('ℹ️ يتطلب كشاف الكاميرا الفعلي جهاز هاتف متوافق وسماح الكاميرا. تم تفعيل الوميض البصري على الشاشة.');
        setRealTorchActive(nextState);
      }
    } catch {
      showToast('تعذر الوصول للكشاف الفعلي، يمكنك استخدام وميض الشاشة.');
    }
  };

  const handlePreviewEdge = () => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
    }, 2800);
    showToast('✨ معاينة إضاءة الحواف النيون نشطة!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Image Layer */}
      {bgConfig.enabled && bgConfig.imageUrl && (
        <div 
          id="app-dynamic-background"
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
          aria-hidden="true"
        >
          <img
            src={bgConfig.imageUrl}
            alt="خلفية التطبيق"
            className="w-full h-full object-cover object-center transition-all duration-700 transform scale-105"
            style={{
              filter: `blur(${bgConfig.blur}px)`,
              opacity: bgConfig.opacity / 100
            }}
            referrerPolicy="no-referrer"
          />
          <div 
            className="absolute inset-0 bg-slate-950 transition-opacity duration-300"
            style={{ opacity: bgConfig.darkOverlay / 100 }}
          />
        </div>
      )}

      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Zap className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      {/* Main App Bar Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-amber-500/20">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  إشعارات الفلاش وإضاءة الحواف المضيئة
                </h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Flash Alerts
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                وميض فلاش الكاميرا + إضاءة حواف الشاشة (Edge Lighting) للمكالمات والرسائل
              </p>
            </div>
          </div>

          {/* Quick Header Badges & Actions */}
          <div className="flex items-center gap-2">
            <button
              id="btn-header-background"
              onClick={() => setIsBgModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="تخصيص خلفية التطبيق"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>خلفية التطبيق</span>
              {bgConfig.enabled && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              id="btn-header-real-torch"
              onClick={handleToggleRealTorch}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                realTorchActive 
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' 
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
              title="تجربة كشاف الهاتف الحقيقي"
            >
              <Flashlight className="w-3.5 h-3.5" />
              <span>{realTorchActive ? 'الكشاف شغّال' : 'كشاف الهاتف'}</span>
            </button>

            <button
              id="btn-header-fullscreen"
              onClick={() => setIsFullScreenOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="تفعيل وضع الشاشة الكاملة كمنبه مضيء"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">شاشة مضيئة كاملة</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-900 scrollbar-none">
            <button
              id="tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'simulator'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>محاكي الهاتف والتنبيهات</span>
            </button>

            <button
              id="tab-edge"
              onClick={() => setActiveTab('edge')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'edge'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>تخصيص إضاءة الحواف (Edge)</span>
            </button>

            <button
              id="tab-guides"
              onClick={() => setActiveTab('guides')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'guides'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>دليل التفعيل في هاتفك (الآيفون والسامسونج وغيرها)</span>
            </button>

            <button
              id="tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>سجل التنبيهات ({alertHistory.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* TAB 1: Phone Simulator & Controls */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Simulator Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center sticky lg:top-32">
              <PhoneSimulator
                activeAlert={activeAlert}
                onDismissAlert={handleDismissAlert}
                edgeConfig={edgeConfig}
                flashConfig={flashConfig}
                isFlashing={isFlashing}
                onTriggerTestCall={handleTriggerCall}
                onTriggerTestWhatsApp={handleTriggerWhatsApp}
                wallpaperUrl={bgConfig.enabled && bgConfig.applyToPhone ? bgConfig.imageUrl : undefined}
              />
            </div>

            {/* Controls & Configuration Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <FlashControls
                flashConfig={flashConfig}
                onUpdateFlashConfig={(changes) => setFlashConfig((prev) => ({ ...prev, ...changes }))}
                onTriggerCall={handleTriggerCall}
                onTriggerWhatsApp={handleTriggerWhatsApp}
                onTriggerSMS={handleTriggerSMS}
                onTriggerAlarm={handleTriggerAlarm}
                onTriggerCustom={handleTriggerCustom}
                onToggleRealTorch={handleToggleRealTorch}
                realTorchActive={realTorchActive}
                onOpenFullScreen={() => setIsFullScreenOpen(true)}
                isFlashing={isFlashing}
                onStopFlashing={handleDismissAlert}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Edge Lighting Customizer */}
        {activeTab === 'edge' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex justify-center sticky lg:top-32">
              <PhoneSimulator
                activeAlert={activeAlert}
                onDismissAlert={handleDismissAlert}
                edgeConfig={edgeConfig}
                flashConfig={flashConfig}
                isFlashing={isFlashing}
                onTriggerTestCall={handleTriggerCall}
                onTriggerTestWhatsApp={handleTriggerWhatsApp}
                wallpaperUrl={bgConfig.enabled && bgConfig.applyToPhone ? bgConfig.imageUrl : undefined}
              />
            </div>
            <div className="lg:col-span-7">
              <EdgeSettings
                edgeConfig={edgeConfig}
                onUpdateEdgeConfig={(changes) => setEdgeConfig((prev) => ({ ...prev, ...changes }))}
                onPreviewEdge={handlePreviewEdge}
              />
            </div>
          </div>
        )}

        {/* TAB 3: Native Phone Guides */}
        {activeTab === 'guides' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 leading-relaxed flex items-center gap-3">
              <Info className="w-5 h-5 text-amber-400 shrink-0" />
              <p>
                <strong>معلومة تهمك:</strong> أغلب الهواتف الحديثة (آيفون، سامسونج، شاومي، أوبو) تحتوي بالفعل على ميزة "وميض الفلاش" مدمجة داخل إعدادات إمكانية الوصول بدون الحاجة لأي برامج خارجية. اتبع الخطوات أدناه لتفعيلها مباشرة في هاتفك!
              </p>
            </div>
            <PhoneGuides />
          </div>
        )}

        {/* TAB 4: Alert History */}
        {activeTab === 'history' && (
          <div className="max-w-3xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">سجل الإشعارات والتنبيهات المضيئة</h3>
              </div>
              <button
                id="btn-clear-history"
                onClick={() => setAlertHistory([])}
                className="text-xs text-rose-400 hover:underline"
              >
                مسح السجل
              </button>
            </div>

            {alertHistory.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                لا توجد إشعارات مسجلة بعد. جرب إرسال تنبيه من علامة تبويب المحاكي!
              </div>
            ) : (
              <div className="space-y-2.5">
                {alertHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-950 font-bold shrink-0 text-xs mt-0.5"
                        style={{ backgroundColor: item.accentColor }}
                      >
                        {item.type === 'call' ? '📞' : item.type === 'whatsapp' ? '💬' : '🔔'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{item.sender}</span>
                          <span className="text-[10px] text-slate-400">({item.title})</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">{item.message}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Fullscreen Alert Overlay Modal */}
      <FullScreenAlertModal
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        edgeConfig={edgeConfig}
        flashConfig={flashConfig}
        activeAlert={activeAlert}
        onTriggerCall={handleTriggerCall}
        onTriggerWhatsApp={handleTriggerWhatsApp}
        onDismissAlert={handleDismissAlert}
        isFlashing={isFlashing}
        onToggleStrobe={() => setIsFlashing(!isFlashing)}
      />

      {/* Background Settings Modal */}
      <BackgroundSettingsModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        config={bgConfig}
        onChange={setBgConfig}
        defaultImageUrl={DEFAULT_BG_IMAGE}
      />

      {/* Floating Quick Background Access Button */}
      <button
        id="btn-floating-bg-quick"
        onClick={() => setIsBgModalOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 px-3.5 py-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 group"
        title="تعديل وتخصيص خلفية التطبيق"
      >
        <ImageIcon className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">تخصيص الخلفية</span>
      </button>

      {/* App Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            برنامج ومحاكي إشعارات الفلاش وإضاءة الحواف الذكية
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>دعم أندرويد و iOS</span>
            <span>•</span>
            <span>فلاش الكاميرا الحقيقي</span>
            <span>•</span>
            <span>ألوان نيون مخصصة</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
