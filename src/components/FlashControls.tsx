import React, { useState } from 'react';
import { 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  AlarmClock, 
  Flashlight, 
  Maximize2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Sliders,
  Send
} from 'lucide-react';
import { FlashConfig, FlashRhythm } from '../types';

interface FlashControlsProps {
  flashConfig: FlashConfig;
  onUpdateFlashConfig: (newConfig: Partial<FlashConfig>) => void;
  onTriggerCall: () => void;
  onTriggerWhatsApp: () => void;
  onTriggerSMS: () => void;
  onTriggerAlarm: () => void;
  onTriggerCustom: (sender: string, message: string) => void;
  onToggleRealTorch: () => Promise<void>;
  realTorchActive: boolean;
  onOpenFullScreen: () => void;
  isFlashing: boolean;
  onStopFlashing: () => void;
}

export const FlashControls: React.FC<FlashControlsProps> = ({
  flashConfig,
  onUpdateFlashConfig,
  onTriggerCall,
  onTriggerWhatsApp,
  onTriggerSMS,
  onTriggerAlarm,
  onTriggerCustom,
  onToggleRealTorch,
  realTorchActive,
  onOpenFullScreen,
  isFlashing,
  onStopFlashing
}) => {
  const [customSender, setCustomSender] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const rhythms: { id: FlashRhythm; label: string; desc: string }[] = [
    { id: 'classic', label: 'كلاسيكي (3 ومضات)', desc: 'وميض ثلاثي سريع ومتوازن' },
    { id: 'heartbeat', label: 'نبض مزدوج', desc: 'وميض مزدوج مثل نبض القلب' },
    { id: 'continuous', label: 'مستمر متكرر', desc: 'وميض مستمر حتى الرد أو المسح' },
    { id: 'strobe', label: 'ستروب فائق السرعة', desc: 'وميض قوي ومكثف لعدم تفويت أي تنبيه' },
    { id: 'sos', label: 'نمط إشارة SOS', desc: 'وميض متقطع بتتابع استغاثة' },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSender.trim()) return;
    onTriggerCustom(customSender, customMessage || 'وصلك تنبيه جديد!');
    setCustomSender('');
    setCustomMessage('');
    setShowCustomForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Active Alert Banner & Stop button */}
      {isFlashing && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <div>
              <p className="text-sm font-bold text-amber-300">الإشعار المضيء نشط الآن!</p>
              <p className="text-xs text-slate-300">يومض فلاش الكاميرا وتضيء حواف الشاشة...</p>
            </div>
          </div>
          <button
            id="btn-stop-flashing"
            onClick={onStopFlashing}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95"
          >
            إيقاف الوميض
          </button>
        </div>
      )}

      {/* QUICK PRESET TEST BUTTONS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">اختبار إشعارات مضيئة فورية</h2>
          </div>
          <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
            تجربة فورية
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          اختر نوع الإشعار لتجربة استجابة الهاتف، حيث يبدأ الفلاش بالوميض وتتحرك إضاءة الحواف مع أصوات التنبيه:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Test Incoming Call */}
          <button
            id="btn-test-call"
            onClick={onTriggerCall}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-950/20 transition-all text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">مكالمة واردة</span>
            <span className="text-[10px] text-slate-400 mt-0.5">رنين + فلاش دائم</span>
          </button>

          {/* Test WhatsApp */}
          <button
            id="btn-test-whatsapp"
            onClick={onTriggerWhatsApp}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-green-500/30 hover:border-green-500 hover:bg-green-950/20 transition-all text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">رسالة واتساب</span>
            <span className="text-[10px] text-slate-400 mt-0.5">وميضان + حواف خضراء</span>
          </button>

          {/* Test SMS */}
          <button
            id="btn-test-sms"
            onClick={onTriggerSMS}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-950/20 transition-all text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">رسالة نصية SMS</span>
            <span className="text-[10px] text-slate-400 mt-0.5">وميض + حواف زرقاء</span>
          </button>

          {/* Test Alarm */}
          <button
            id="btn-test-alarm"
            onClick={onTriggerAlarm}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-amber-500/30 hover:border-amber-500 hover:bg-amber-950/20 transition-all text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <AlarmClock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">منبه وإنذار</span>
            <span className="text-[10px] text-slate-400 mt-0.5">ستروب عالي الوميض</span>
          </button>
        </div>

        {/* Real Torch and Fullscreen buttons */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <button
            id="btn-toggle-real-torch"
            onClick={onToggleRealTorch}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs transition-all shadow-md ${
              realTorchActive
                ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 shadow-amber-400/20'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <Flashlight className="w-4 h-4" />
            {realTorchActive ? 'إطفاء كشاف الهاتف الفعلي' : 'تشغيل كشاف الهاتف الحقيقي (فلاش الكاميرا)'}
          </button>

          <button
            id="btn-open-fullscreen-alert"
            onClick={onOpenFullScreen}
            className="flex items-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
            title="تجربة وميض الشاشة بالكامل"
          >
            <Maximize2 className="w-4 h-4 text-amber-400" />
            شاشة كاملة مضيئة
          </button>
        </div>
      </div>

      {/* CUSTOM NOTIFICATION MAKER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-400" />
            إرسال إشعار تجريبي مخصص
          </h3>
          <button
            id="btn-toggle-custom-form"
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="text-xs text-amber-400 hover:underline"
          >
            {showCustomForm ? 'إخفاء' : 'كتابة إشعار خاص'}
          </button>
        </div>

        {showCustomForm && (
          <form onSubmit={handleCustomSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">اسم المرسل أو التطبيق</label>
              <input
                id="input-custom-sender"
                type="text"
                value={customSender}
                onChange={(e) => setCustomSender(e.target.value)}
                placeholder="مثلاً: المدير، تلغرام، إنستغرام..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">نص الرسالة</label>
              <input
                id="input-custom-message"
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="مثلاً: برجاء الرد على الملف المرفق عاجلاً"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
            <button
              id="btn-submit-custom-alert"
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              إرسال وميض وتنبيه تجريبي
            </button>
          </form>
        )}
      </div>

      {/* FLASH CONFIGURATION SETTINGS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">إعدادات ونمط وميض الفلاش</h3>
          </div>
        </div>

        {/* Rhythm Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            إيقاع وميض الفلاش عند استقبال التنبيه:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {rhythms.map((r) => (
              <button
                key={r.id}
                id={`btn-rhythm-${r.id}`}
                onClick={() => onUpdateFlashConfig({ rhythm: r.id })}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  flashConfig.rhythm === r.id
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold">{r.label}</span>
                <span className="text-[10px] text-slate-400 mt-1">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <span className="text-xs font-medium text-slate-200">فلاش الكاميرا الخلفي</span>
            <input
              type="checkbox"
              id="toggle-camera-flash"
              checked={flashConfig.cameraFlashEnabled}
              onChange={(e) => onUpdateFlashConfig({ cameraFlashEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <span className="text-xs font-medium text-slate-200">وميض الشاشة الكاملة</span>
            <input
              type="checkbox"
              id="toggle-screen-flash"
              checked={flashConfig.screenFlashEnabled}
              onChange={(e) => onUpdateFlashConfig({ screenFlashEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
              {flashConfig.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              الصوت والنغمات
            </span>
            <input
              type="checkbox"
              id="toggle-sound"
              checked={flashConfig.soundEnabled}
              onChange={(e) => onUpdateFlashConfig({ soundEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
              <Vibrate className="w-3.5 h-3.5 text-indigo-400" />
              الاهتزاز (Vibration)
            </span>
            <input
              type="checkbox"
              id="toggle-vibrate"
              checked={flashConfig.vibrateEnabled}
              onChange={(e) => onUpdateFlashConfig({ vibrateEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
