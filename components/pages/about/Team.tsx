"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { unescapeHTML } from "@/lib/utils";

export default function AboutTeam({ 
  locale,
  header,
  team 
}: { 
  locale: string;
  header: any;
  team: any;
}) {
  const l = locale as 'en' | 'ar';

  return (
    <section className="py-12 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 sm:mb-14">
          <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
            {header?.badge?.[l] || (l === 'ar' ? "الأشخاص وراء BZNX" : "The People Behind BZNX")}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#091d37] uppercase tracking-tighter leading-[0.95]"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(header?.title?.[l] || (l === 'ar' ? "التقِ <span class='text-[#091d37]/25'>بالفريق</span>" : "Meet The <span class='text-[#091d37]/25'>Team</span>")) }}
          />
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 gap-6">
          {(Array.isArray(team) ? team : team?.items || []).map((member: any, idx: number) => (
            <div key={idx} className="group flex flex-col">
              {/* Photo */}
              <div className="relative rounded-2xl overflow-hidden aspect-3/4 mb-5">
                <Image
                  src={(typeof member.image === "string" ? member.image : member.image?.url) || "/team/Mohammed.webp"}
                  alt={member.name?.[l] || "Team Member"}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#091d37]/80 via-transparent to-transparent" />

                {/* LinkedIn on hover */}
              {member.link && (
                <a
                  href={member.link}
                  className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-teal flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#091d37]" />
                </a>
              )}
              </div>

              {/* Info */}
              <div>
                <p className="text-teal text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                  {member.title?.[l]}
                </p>
                <h3 className="text-[#091d37] font-black text-sm uppercase tracking-tight mb-2">
                  {member.name?.[l]}
                </h3>
                <div  className="text-[#091d37]/45 text-xs leading-relaxed ql-editor-view"
                  dangerouslySetInnerHTML={{ __html: unescapeHTML(member.description?.[l]) }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
