import { Link } from "wouter";
import { Car, BookOpen, CalendarClock, CheckCircle2, EyeOff, AlertCircle } from "lucide-react";
import { useListVehicles, useListBlogPosts, useListBookings } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

function StatCard({
  to,
  label,
  value,
  icon: Icon,
  accent = "primary",
}: {
  to: string;
  label: string;
  value: string | number;
  icon: typeof Car;
  accent?: "primary" | "green" | "amber" | "red";
}) {
  const accents: Record<string, string> = {
    primary: "border-primary/30 text-primary",
    green: "border-green-500/30 text-green-400",
    amber: "border-amber-500/30 text-amber-400",
    red: "border-red-500/30 text-red-400",
  };
  return (
    <Link
      href={to}
      className="block bg-[#0a0a0a] border border-white/10 p-6 hover:border-primary/40 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-xs uppercase tracking-wider font-light">{label}</span>
        <div className={`w-10 h-10 border ${accents[accent]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-4xl font-serif text-white">{value}</div>
    </Link>
  );
}

export function AdminDashboardPage() {
  const { data: vehicles } = useListVehicles();
  const { data: posts } = useListBlogPosts();
  const { data: bookings } = useListBookings();

  const total = vehicles?.length ?? 0;
  const available = vehicles?.filter((v) => v.status === "available").length ?? 0;
  const busy = vehicles?.filter((v) => v.status === "busy" || v.status === "reserved").length ?? 0;
  const hidden = vehicles?.filter((v) => v.status === "hidden").length ?? 0;

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        <div>
          <p className="text-primary uppercase tracking-[0.3em] text-xs mb-2">Overview</p>
          <p className="text-gray-400 font-light">
            Welcome back. Here's what's happening across the fleet, journal, and bookings.
          </p>
        </div>

        <section>
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Fleet</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard to="/admin/fleet" label="Total Vehicles" value={total} icon={Car} />
            <StatCard
              to="/admin/fleet"
              label="Available"
              value={available}
              icon={CheckCircle2}
              accent="green"
            />
            <StatCard
              to="/admin/fleet"
              label="Reserved / Busy"
              value={busy}
              icon={AlertCircle}
              accent="amber"
            />
            <StatCard
              to="/admin/fleet"
              label="Hidden"
              value={hidden}
              icon={EyeOff}
              accent="red"
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Content & Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              to="/admin/blog"
              label="Blog Posts"
              value={posts?.length ?? 0}
              icon={BookOpen}
            />
            <StatCard
              to="/admin/bookings"
              label="Booking Requests"
              value={bookings?.length ?? 0}
              icon={CalendarClock}
            />
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
