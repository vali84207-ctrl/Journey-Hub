import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListVehicles, 
  getListVehiclesQueryKey,
  useUpdateVehicleStatus, 
  useListBookings,
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { RefreshCw, Car, CalendarClock, ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminPage() {
  const queryClient = useQueryClient();
  const { data: vehicles, isLoading: vehiclesLoading } = useListVehicles();
  const { data: bookings, isLoading: bookingsLoading, refetch: refetchBookings } = useListBookings();
  const updateStatus = useUpdateVehicleStatus();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusUpdate = (id: number, status: "available" | "reserved" | "busy") => {
    setUpdatingId(id);
    updateStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
          setUpdatingId(null);
        },
        onError: () => {
          setUpdatingId(null);
        }
      }
    );
  };

  const handleRefresh = () => {
    refetchBookings();
    queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <Link href="/" className="inline-flex items-center text-primary hover:text-white transition-colors mb-4 text-sm uppercase tracking-wider cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Site
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-white flex items-center gap-3">
              <ShieldAlert className="text-primary w-8 h-8" />
              Admin Control Panel
            </h1>
          </div>
          <Button 
            onClick={handleRefresh}
            variant="outline" 
            className="border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
          </Button>
        </div>

        {/* Vehicle Management */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Car className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-serif text-white">Vehicle Status Management</h2>
          </div>

          {vehiclesLoading ? (
            <div className="h-32 flex items-center justify-center border border-white/5 bg-white/5">
              <span className="text-gray-500">Loading vehicles...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {vehicles?.map(vehicle => (
                <div key={vehicle.id} className="bg-black border border-white/10 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-lg">{vehicle.code}</span>
                      <span className="text-gray-400 text-sm">{vehicle.model}</span>
                    </div>
                    <div className="text-xs text-gray-500">Last updated: {format(new Date(vehicle.updatedAt), "PPp")}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto p-1 bg-white/5 rounded-md border border-white/5">
                    {(["available", "reserved", "busy"] as const).map(status => (
                      <button
                        key={status}
                        disabled={updatingId === vehicle.id}
                        onClick={() => handleStatusUpdate(vehicle.id, status)}
                        className={`px-3 py-1.5 text-xs tracking-wider uppercase font-medium rounded transition-all flex-1 sm:flex-none ${
                          vehicle.status === status
                            ? status === "available" ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                              : status === "reserved" ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                              : "bg-red-500/20 text-red-400 border border-red-500/50"
                            : "bg-transparent text-gray-500 hover:bg-white/10 border border-transparent"
                        } ${(updatingId === vehicle.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Booking Requests */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <CalendarClock className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-serif text-white">Recent Booking Requests</h2>
          </div>

          {bookingsLoading ? (
            <div className="h-64 flex items-center justify-center border border-white/5 bg-white/5">
              <span className="text-gray-500">Loading bookings...</span>
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="h-48 flex items-center justify-center border border-white/5 bg-white/5">
              <span className="text-gray-500 font-light">No bookings found.</span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-sm border border-white/10 bg-black">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID / Date</th>
                    <th className="px-6 py-4 font-medium">Client Info</th>
                    <th className="px-6 py-4 font-medium">Journey</th>
                    <th className="px-6 py-4 font-medium">Vehicle / Pax</th>
                    <th className="px-6 py-4 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, i) => (
                    <tr key={booking.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}`}>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-gray-500 mb-1">#{booking.id}</div>
                        <div className="font-medium text-white">{booking.date}</div>
                        <div className="text-gray-400">{booking.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-primary">{booking.fullName}</div>
                        <div className="text-gray-300 font-mono text-xs mt-1">{booking.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300"><span className="text-gray-500 text-xs uppercase mr-2">From</span>{booking.pickup}</div>
                        <div className="text-gray-300 mt-1"><span className="text-gray-500 text-xs uppercase mr-2">To</span>{booking.destination}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-white mb-1">{booking.carType}</div>
                        <div className="text-gray-400 text-xs">{booking.passengers} Passengers</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {format(new Date(booking.createdAt), "PPp")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
