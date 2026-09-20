import React from 'react';
import { Palette, Sparkles, SlidersHorizontal, SunMedium } from 'lucide-react';
import { EdgeLightingConfig, EdgeAnimationStyle } from '../types';

interface EdgeSettingsProps {
  edgeConfig: EdgeLightingConfig;
  onUpdateEdgeConfig: (newConfig: Partial<EdgeLightingConfig>) => void;
  onPreviewEdge: () => void;
}

export const EdgeSettings: React.FC<EdgeSettingsProps> = ({
  edgeConfig,
  onUpdateEdgeConfig,
  onPreviewEdge
}) => {
  const styles: { id: EdgeAnimationStyle; label: string; desc: string }[] = [
    { id: 'laser', label: 'ليزر متدفق (Laser)', desc: 'خط ليزر نيون يتحرك حول كامل محيط الشاشة' },
    { id: 'pulse', label: 'نبض نيون (Pulsing)', desc: 'نبض متوهج وناعم يغطي أطراف الشاشة' },
    { id: 'wave', label: 'أمواج مضيئة (Wave)', desc: 'تدفق ضوئي سينمائي مضاعف' },
    { id: 'corners', label: 'أركان نيون (Corners)', desc: 'إضاءة زوايا الهاتف الأربعة بأسلوب مستقبلي' },
  ];

  const colorPresets = [
    { name: 'سماوي نيون', hex: '#00f0ff' },
    { name: 'كهرماني ذهبي', hex: '#ffb703' },
    { name: 'أخضر زمردي', hex: '#10b981' },
    { name: 'بنفسجي سايبر', hex: '#a855f7' },
    { name: 'وردي نيون', hex: '#f43f5e' },
    { name: 'أبيض ماسي', hex: '#ffffff' },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">تخصيص إضاءة حواف الشاشة (Edge Lighting)</h3>
        </div>
        <button
          id="btn-preview-edge-lighting"
          onClick={onPreviewEdge}
          className="text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-3 py-1.5 rounded-full font-bold transition-all"
        >
          معاينة الإضاءة
        </button>
      </div>

      {/* Enable Edge Lighting Toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
        <div>
          <span className="text-xs font-bold text-white block">تشغيل إضاءة الحواف</span>
          <span className="text-[11px] text-slate-400">تضيء جوانب الشاشة بألوان متحركة عند وصول إشعار</span>
        </div>
        <input
          type="checkbox"
          id="toggle-edge-lighting"
          checked={edgeConfig.enabled}
          onChange={(e) => onUpdateEdgeConfig({ enabled: e.target.checked })}
          className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400"
        />
      </div>

      {/* Style selector */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">
          نمط حركة الإضاءة:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {styles.map((style) => (
            <button
              key={style.id}
              id={`btn-edge-style-${style.id}`}
              onClick={() => onUpdateEdgeConfig({ style: style.id })}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                edgeConfig.style === style.id
                  ? 'border-amber-500 bg-amber-500/10 text-white'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-xs font-bold">{style.label}</span>
              <span className="text-[10px] text-slate-400 mt-1">{style.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          لون الإضاءة النيون:
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          {colorPresets.map((c) => (
            <button
              key={c.hex}
              id={`btn-edge-color-${c.hex.replace('#', '')}`}
              onClick={() => onUpdateEdgeConfig({ primaryColor: c.hex })}
              className={`w-9 h-9 rounded-full transition-all flex items-center justify-center relative ${
                edgeConfig.primaryColor === c.hex
                  ? 'ring-3 ring-white ring-offset-2 ring-offset-slate-950 scale-110'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            >
              {edgeConfig.primaryColor === c.hex && (
                <div className="w-2 h-2 rounded-full bg-slate-950" />
              )}
            </button>
          ))}

          {/* Custom color input */}
          <div className="relative flex items-center">
            <input
              type="color"
              id="input-custom-edge-color"
              value={edgeConfig.primaryColor}
              onChange={(e) => onUpdateEdgeConfig({ primaryColor: e.target.value })}
              className="w-9 h-9 rounded-full cursor-pointer bg-transparent border-0 p-0 overflow-hidden"
              title="لون مخصص"
            />
          </div>
        </div>
      </div>

      {/* Sliders: Thickness & Glow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-300 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-slate-400" />
              سماكة الإضاءة
            </span>
            <span className="text-amber-400 font-mono">{edgeConfig.thickness}px</span>
          </div>
          <input
            type="range"
            id="range-thickness"
            min="2"
            max="8"
            step="1"
            value={edgeConfig.thickness}
            onChange={(e) => onUpdateEdgeConfig({ thickness: Number(e.target.value) })}
            className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-300 flex items-center gap-1">
              <SunMedium className="w-3 h-3 text-slate-400" />
              قوة التوهج (Glow)
            </span>
            <span className="text-amber-400 font-mono">{edgeConfig.glowIntensity}x</span>
          </div>
          <input
            type="range"
            id="range-glow"
            min="1"
            max="5"
            step="1"
            value={edgeConfig.glowIntensity}
            onChange={(e) => onUpdateEdgeConfig({ glowIntensity: Number(e.target.value) })}
            className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
