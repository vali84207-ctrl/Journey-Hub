import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Car, BookOpen, CalendarClock, LogOut, Menu, X, ArrowLeft } from "lucide-react";
import { clearAdminToken } from "@/lib/adminAuth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/fleet", label: "Fleet", icon: Car },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarClock },
];

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearAdminToken();
    setLocation("/admin/login");
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? location === href : location === href || location.startsWith(href + "/");

  const navList = (
    <nav className="flex flex-col gap-1 p-4">
      {NAV.map(({ href, label, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-colors border-l-2 cursor-pointer ${
            isActive(href, exact)
              ? "bg-primary/10 text-primary border-primary"
              : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="uppercase font-light">{label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-black sticky top-0 h-screen">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="block cursor-pointer">
            <div className="text-primary font-serif text-lg leading-none">Pamir Luxe</div>
            <div className="text-gray-500 text-[10px] tracking-[0.3em] uppercase mt-1">Admin Panel</div>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">{navList}</div>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-xs uppercase tracking-wider text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 bg-black border-r border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="text-primary font-serif text-lg leading-none">Pamir Luxe</div>
                <div className="text-gray-500 text-[10px] tracking-[0.3em] uppercase mt-1">Admin Panel</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navList}</div>
            <div className="p-4 border-t border-white/10 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2 text-xs uppercase tracking-wider text-gray-500"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Site
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs uppercase tracking-wider text-red-400"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur border-b border-white/10 px-4 md:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-gray-300 hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl md:text-2xl font-serif text-white">{title}</h1>
        </header>
        <div className="p-4 md:p-8 max-w-[1400px]">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
  pending,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  pending?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0a0a0a] border border-red-500/30 max-w-md w-full p-6">
        <h3 className="text-xl font-serif text-white mb-2">{title}</h3>
        <p className="text-gray-400 font-light mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={pending}
            className="px-5 py-2 border border-white/20 text-gray-300 hover:bg-white/5 text-xs uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-xs uppercase tracking-wider disabled:opacity-50"
          >
            {pending ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ModalShell({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4 py-10">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div
          className={`relative bg-[#0a0a0a] border border-primary/20 w-full ${
            wide ? "max-w-4xl" : "max-w-2xl"
          }`}
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
            <h3 className="text-xl font-serif text-primary">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
