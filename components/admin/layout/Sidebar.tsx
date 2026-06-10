"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Home,
  LogOut,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  FileText,
  PenTool,
  Info,
  Phone,
  Layers,
  Zap,
  Globe
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/admin/home", icon: Home },
  { name: "About Us", href: "/admin/about", icon: Info },
  { 
    name: "Service", 
    icon: Zap,
    subItems: [
      { name: "CMS", href: "/admin/services/cms" },
      { name: "Service List", href: "/admin/services/list" },
    ]
  },
  { 
    name: "Blog", 
    icon: PenTool,
    subItems: [
      { name: "CMS", href: "/admin/blogs/cms" },
      { name: "Blog List", href: "/admin/blogs/list" },
    ]
  },
  { 
    name: "Case Study", 
    icon: FileText,
    subItems: [
      { name: "CMS", href: "/admin/case-studies/cms" },
      { name: "Case Study List", href: "/admin/case-studies/list" },
    ]
  },
  { name: "SEO", href: "/admin/seo", icon: Globe },
  { name: "Contact Us", href: "/admin/contact", icon: Phone },
  { name: "Enquiries", href: "/admin/enquiries", icon: MessageCircle },
  { name: "Footer", href: "/admin/footer", icon: Layers },
];

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>(["Service"]);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => 
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-8 pb-12 flex-1 overflow-y-auto">
        <Link href="/admin" className="block mb-12">
          <Image
            src="/bznxlogo.png"
            alt="Logo"
            width={100}
            height={30}
            className="object-contain"
          />
        </Link>

        <div className="mb-4">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 ml-4">
            Management
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isDropdown = !!item.subItems;
              const isOpen = openMenus.includes(item.name);
              const isActive = item.href ? pathname === item.href : item.subItems?.some(sub => pathname === sub.href);
              
              return (
                <li key={item.name}>
                {isDropdown ? (
                  <div>
                    <button 
                      onClick={() => toggleMenu(item.name)}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all group w-full ${
                        isActive 
                          ? "text-[#00C4B4] bg-[#00C4B4]/5 font-black" 
                          : "text-slate-400 hover:text-[#091d37] hover:bg-slate-50 font-bold"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-sm tracking-tight">{item.name}</span>
                      </div>
                      {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {isOpen && (
                      <ul className="mt-1 ml-4 space-y-1 border-l border-slate-100 pl-4">
                        {item.subItems?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <li key={sub.name}>
                              <Link 
                                href={sub.href}
                                className={`block py-2 px-4 rounded-lg text-xs transition-all ${
                                  isSubActive
                                    ? "text-[#00C4B4] font-black bg-[#00C4B4]/5"
                                    : "text-slate-400 hover:text-[#091d37] font-bold"
                                }`}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all group ${
                      isActive
                        ? "text-[#00C4B4] bg-[#00C4B4]/5 font-black"
                        : "text-slate-400 hover:text-[#091d37] hover:bg-slate-50 font-bold"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="text-sm tracking-tight">{item.name}</span>
                    </div>
                    {isActive && <ChevronRight size={14} />}
                  </Link>
                )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="p-6 border-t border-slate-50 bg-white">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-red-500 transition-colors font-bold text-xs uppercase tracking-widest w-full px-4 py-2"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
