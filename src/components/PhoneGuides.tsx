import React, { useState } from 'react';
import { 
  Smartphone, 
  Apple, 
  Flame, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles,
  Layers
} from 'lucide-react';
import { PHONE_GUIDES } from '../data/guides';

export const PhoneGuides: React.FC = () => {
  const [selectedBrandId, setSelectedBrandId] = useState('samsung');

  const selectedGuide = PHONE_GUIDES.find(g => g.id === selectedBrandId) || PHONE_GUIDES[0];

  const getBrandIcon = (id: string) => {
    switch (id) {
      case 'iphone': return <Apple className="w-4 h-4" />;
      case 'samsung': return <Smartphone className="w-4 h-4" />;
      case 'xiaomi': return <Flame className="w-4 h-4" />;
      case 'oppo_realme': return <Zap className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            دليل تفعيل الإشعارات المضيئة والفلاش في هاتفك
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            خطوات مدمجة في نظام هاتفك بدون برامج ثقيلة أو إعلانات مزعجة
          </p>
        </div>
        <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-medium w-fit">
          ميزة رسمية في نظام الهاتف
        </span>
      </div>

      {/* Brand Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {PHONE_GUIDES.map((guide) => (
          <button
            key={guide.id}
            id={`btn-guide-tab-${guide.id}`}
            onClick={() => setSelectedBrandId(guide.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedBrandId === guide.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {getBrandIcon(guide.id)}
            <span>{guide.name}</span>
          </button>
        ))}
      </div>

      {/* Guide Content Display */}
      <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white">
              طريقة التفعيل في {selectedGuide.name}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
            {selectedGuide.osName}
          </span>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-300">خطوات تشغيل فلاش الكاميرا عند الرنين:</h4>
          <ol className="space-y-2">
            {selectedGuide.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5 border border-slate-700">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Edge lighting specific steps if applicable */}
        {selectedGuide.hasEdgeLighting && selectedGuide.edgeLightingSteps && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              لتفعيل إضاءة حواف الشاشة (Edge Lighting) عند وصول الرسائل:
            </h4>
            <ul className="space-y-1.5 pr-2">
              {selectedGuide.edgeLightingSteps.map((estep, eidx) => (
                <li key={eidx} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{estep}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pro Tips Box */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 space-y-1.5">
          <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            نصائح وملاحظات هامة:
          </h5>
          <ul className="space-y-1 pr-1">
            {selectedGuide.tips.map((tip, tidx) => (
              <li key={tidx} className="text-[11px] text-slate-300 list-disc list-inside leading-relaxed">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
