"use client";

import EditHero from "./EditHero";
import { unescapeHTML } from "@/lib/utils";

interface HeroProps {
  data: any;
  route: string;
  section: string;
  displayFields: string[];
  onUpdate: () => void;
  name: string;
}

const Hero = ({ data, route, section, displayFields, onUpdate, name }: HeroProps) => {
  const content = data?.content || {};


  return (
    <div className="bg-white border-b border-slate-50 p-10 mb-8 rounded-xl">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-black text-[#091d37] uppercase tracking-tighter">{name}</h3>
        <EditHero
          data={data}
          section={section}
          route={route}
          displayFields={displayFields}
          onUpdate={onUpdate}
          name={name}
        />
      </div>

      <div className="flex flex-col items-center text-center">

        {/* Title Lines */}
        <div className="mb-6">
          {content.title?.en && <div className="text-4xl text-gray-900 font-black leading-tight" dangerouslySetInnerHTML={{ __html: unescapeHTML(content.title.en) }} />}
          {content.titleLine1?.en && <div className="text-4xl text-gray-900 font-black leading-tight" dangerouslySetInnerHTML={{ __html: unescapeHTML(content.titleLine1.en) }} />}
          {content.titleLine2?.en && <div className="text-4xl text-gray-400 font-black leading-tight" dangerouslySetInnerHTML={{ __html: unescapeHTML(content.titleLine2.en) }} />}
          {content.titleLine3?.en && <div className="text-4xl text-cyan-500 font-black leading-tight" dangerouslySetInnerHTML={{ __html: unescapeHTML(content.titleLine3.en) }} />}
        </div>

        {/* Description */}
        {content.description?.en && (
          <div className="w-full max-w-2xl mx-auto mb-10 overflow-hidden">
            <div
              className="text-lg text-gray-500 leading-relaxed prose prose-sm max-w-none prose-p:my-0 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(content.description.en) }}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mb-10">
          {content.primaryButtonText?.en && (
            <div className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm tracking-wider">
              {content.primaryButtonText.en}
            </div>
          )}
          {content.secondaryButtonText?.en && (
            <div className="bg-transparent border border-gray-300 text-gray-600 px-6 py-2 rounded-full font-bold text-sm tracking-wider">
              {content.secondaryButtonText.en}
            </div>
          )}
        </div>

        {/* Generic Info Grid (for Footer and other sections) */}
        {!content.title && !content.titleLine1 && !content.description && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {displayFields.map((field) => {
              const val = content[field];
              if (!val) return null;
              const displayVal = typeof val === 'object' ? (val.en || val.ar || JSON.stringify(val)) : val;
              return (
                <div key={field} className="bg-slate-50 p-4 rounded-xl text-left border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{field.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-sm font-bold text-slate-700 line-clamp-2" dangerouslySetInnerHTML={{ __html: unescapeHTML(displayVal) }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
