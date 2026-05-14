import { useListBookings } from "@workspace/api-client-react";
import { format } from "date-fns";
import { AdminLayout } from "@/components/admin/AdminLayout";

export function AdminBookingsPage() {
  const { data: bookings, isLoading } = useListBookings();

  return (
    <AdminLayout title="Booking Requests">
      <div className="space-y-6">
        <p className="text-gray-400 font-light">
          {bookings?.length ?? 0} bookings received via the website. Telegram notifications are sent
          automatically.
        </p>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center border border-white/5 bg-white/5">
            <span className="text-gray-500">Loading bookings…</span>
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="h-48 flex items-center justify-center border border-white/5 bg-white/5">
            <span className="text-gray-500 font-light">No bookings yet.</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-sm border border-white/10 bg-[#0a0a0a]">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">ID / Date</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Journey</th>
                  <th className="px-6 py-4 font-medium">Vehicle / Pax</th>
                  <th className="px-6 py-4 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={b.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-gray-500 mb-1">#{b.id}</div>
                      <div className="font-medium text-white">{b.date}</div>
                      <div className="text-gray-400">{b.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary">{b.fullName}</div>
                      <div className="text-gray-300 font-mono text-xs mt-1">{b.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">
                        <span className="text-gray-500 text-xs uppercase mr-2">From</span>
                        {b.pickup}
                      </div>
                      <div className="text-gray-300 mt-1">
                        <span className="text-gray-500 text-xs uppercase mr-2">To</span>
                        {b.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-white mb-1">{b.carType}</div>
                      <div className="text-gray-400 text-xs">{b.passengers} Passengers</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {format(new Date(b.createdAt), "PPp")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
