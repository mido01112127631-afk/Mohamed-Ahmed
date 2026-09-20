import React, { useState, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Upload, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Smartphone,
  Sliders
} from 'lucide-react';
import { BackgroundConfig } from '../types';

interface BackgroundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BackgroundConfig;
  onChange: (newConfig: BackgroundConfig) => void;
  defaultImageUrl: string;
}

export const BackgroundSettingsModal: React.FC<BackgroundSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
  defaultImageUrl
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (PNG, JPG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange({
          ...config,
          enabled: true,
          imageUrl: e.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleResetDefault = () => {
    onChange({
      ...config,
      imageUrl: defaultImageUrl,
      enabled: true,
      blur: 4,
      opacity: 85,
      darkOverlay: 60,
      applyToPhone: true
    });
  };

  return (
    <div 
      id="modal-background-settings"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">تخصيص خلفية التطبيق</h2>
              <p className="text-xs text-slate-400">التحكم في الصورة والعتامة والتأثيرات</p>
            </div>
          </div>
          <button
            id="btn-close-bg-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Live Preview Card */}
          <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800 shadow-inner group">
            {/* Background image preview */}
            <img
              src={config.imageUrl}
              alt="معاينة الخلفية"
              className="w-full h-full object-cover object-center transition-all duration-300"
              style={{
                filter: `blur(${config.blur}px)`,
                opacity: config.enabled ? config.opacity / 100 : 0.2
              }}
              referrerPolicy="no-referrer"
            />
            {/* Dark overlay preview */}
            <div 
              className="absolute inset-0 bg-slate-950" 
              style={{ opacity: config.enabled ? config.darkOverlay / 100 : 0.9 }}
            />

            {/* Overlay preview sample content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold bg-slate-950/70 text-amber-400 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-800">
                  معاينة مظهر الخلفية المباشر
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {config.enabled ? 'مفعّلة' : 'معطلة'}
                </span>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/60 max-w-[260px]">
                <p className="text-xs font-bold text-white">نص توضيحي لاختبار وضوح القراءة</p>
                <p className="text-[10px] text-slate-300">درجة التباين مضبوطة لتسهيل استخدام التطبيق</p>
              </div>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            {/* Main Background Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {config.enabled ? (
                  <Eye className="w-4 h-4 text-emerald-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-500" />
                )}
                <div>
                  <label htmlFor="toggle-bg-enable" className="text-xs font-bold text-white block cursor-pointer">
                    تفعيل صورة الخلفية للتطبيق
                  </label>
                  <span className="text-[10px] text-slate-400">إظهار الصورة كخلفية لجميع شاشات التطبيق</span>
                </div>
              </div>
              <input
                id="toggle-bg-enable"
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => onChange({ ...config, enabled: e.target.checked })}
                className="w-5 h-5 accent-amber-500 cursor-pointer rounded"
              />
            </div>

            <div className="border-t border-slate-800/60 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <div>
                  <label htmlFor="toggle-phone-bg" className="text-xs font-bold text-white block cursor-pointer">
                    تطبيق الصورة كخلفية شاشة محاكي الهاتف
                  </label>
                  <span className="text-[10px] text-slate-400">تظهر أيضاً في شاشة القفل داخل المحاكي</span>
                </div>
              </div>
              <input
                id="toggle-phone-bg"
                type="checkbox"
                checked={config.applyToPhone}
                onChange={(e) => onChange({ ...config, applyToPhone: e.target.checked })}
                className="w-5 h-5 accent-amber-500 cursor-pointer rounded"
              />
            </div>
          </div>

          {/* Slider Controls */}
          <div className="space-y-4">
            {/* Dark Overlay Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">درجة التعتيم الداكن (Dark Overlay):</span>
                <span className="text-amber-400">{config.darkOverlay}%</span>
              </div>
              <input
                id="slider-dark-overlay"
                type="range"
                min="10"
                max="95"
                step="5"
                value={config.darkOverlay}
                onChange={(e) => onChange({ ...config, darkOverlay: Number(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">زيادة التعتيم تجعل النصوص والأزرار أكثر وضوحاً وقراءة.</p>
            </div>

            {/* Blur Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">درجة الضبابية (Blur Effect):</span>
                <span className="text-amber-400">{config.blur}px</span>
              </div>
              <input
                id="slider-bg-blur"
                type="range"
                min="0"
                max="20"
                step="1"
                value={config.blur}
                onChange={(e) => onChange({ ...config, blur: Number(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">الضبابية الناعمة تعطي إحساساً حديثاً مع إبراز محتوى التطبيق.</p>
            </div>

            {/* Opacity Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">شفافية الصورة (Opacity):</span>
                <span className="text-amber-400">{config.opacity}%</span>
              </div>
              <input
                id="slider-bg-opacity"
                type="range"
                min="20"
                max="100"
                step="5"
                value={config.opacity}
                onChange={(e) => onChange({ ...config, opacity: Number(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>
          </div>

          {/* Preset Styles */}
          <div>
            <span className="text-xs font-bold text-slate-300 block mb-2">أنماط سريعة جاهزة:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-preset-natural"
                type="button"
                onClick={() => onChange({ ...config, enabled: true, blur: 0, darkOverlay: 40, opacity: 90 })}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold text-center transition-all"
              >
                أصلي نقي (0px)
              </button>
              <button
                id="btn-preset-balanced"
                type="button"
                onClick={() => onChange({ ...config, enabled: true, blur: 4, darkOverlay: 60, opacity: 85 })}
                className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold text-center transition-all"
              >
                متوازن مثالي ✨
              </button>
              <button
                id="btn-preset-cinematic"
                type="button"
                onClick={() => onChange({ ...config, enabled: true, blur: 8, darkOverlay: 80, opacity: 75 })}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold text-center transition-all"
              >
                تعتيم تركيز (8px)
              </button>
            </div>
          </div>

          {/* Upload Custom Image (Drag & Drop + Click) */}
          <div>
            <span className="text-xs font-bold text-slate-300 block mb-2">تغيير أو رفع صورة جديدة:</span>
            <div
              id="dropzone-bg-upload"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-amber-400 bg-amber-500/10 scale-[0.99]' 
                  : 'border-slate-700 hover:border-slate-500 bg-slate-950/40 hover:bg-slate-950/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <Upload className="w-6 h-6 text-amber-400 mb-1.5" />
              <p className="text-xs font-bold text-white">اسحب وأفلت صورة هنا أو اضغط للاختيار</p>
              <p className="text-[10px] text-slate-400 mt-0.5">يدعم صور PNG, JPG, WebP من جهازك</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            id="btn-reset-default-bg"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold py-1.5 px-3 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>الصورة الأصلية الافتراضية</span>
          </button>

          <button
            id="btn-confirm-bg"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2 px-5 rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>حفظ وإغلاق</span>
          </button>
        </div>
      </div>
    </div>
  );
};
