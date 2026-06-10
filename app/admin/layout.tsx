"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Home,
  Layout,
  User,
} from "lucide-react";

import Sidebar from "@/components/admin/layout/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoginPage = pathname === "/admin/login" || pathname?.endsWith("/admin/login");
      const isPreviewPage = pathname?.includes("/preview");

      if (isPreviewPage) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          if (isLoginPage) {
            router.push("/admin/home");
          } else {
            setLoading(false);
          }
        } else {
          if (!isLoginPage) {
            router.push("/admin/login");
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        if (!isLoginPage) {
          router.push("/admin/login");
        } else {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const isLoginPage = pathname === "/admin/login" || pathname?.endsWith("/admin/login");
  const isPreviewPage = pathname?.includes("/preview");
  if (isPreviewPage) {
    return (
      <div className="min-h-screen bg-white" style={{ margin: 0, padding: 0 }}>
        {children}
      </div>
    );
  }

  if (loading && !isLoginPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 animate-pulse font-medium">Loading CMS...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Home", href: "/admin/home", icon: Home },
    { name: "Footer", href: "/admin/footer", icon: Layout },
  ];

  const currentPage = navItems.find(item => item.href === pathname)?.name || "Dashboard";

  return (
    <div className="admin-layout min-h-screen bg-white text-slate-900 flex font-sans overflow-hidden">
      {isLoginPage ? (
        <div className="w-full bg-gray-50 flex-1">{children}</div>
      ) : (
        <>
          <Sidebar onLogout={handleLogout} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen bg-white">
            {/* Top Bar */}
            <header className="h-20 bg-white border-b border-slate-50 px-10 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest">{currentPage}</span>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                     <User size={18} className="text-slate-400" />
                  </div>
               </div>
            </header>

            <main className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="max-w-7xl mx-auto bg-gray-100">
                {children}
              </div>
            </main>
          </div>
        </>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}
