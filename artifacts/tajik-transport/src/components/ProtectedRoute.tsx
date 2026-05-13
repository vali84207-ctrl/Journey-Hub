import { useEffect, useState, type ComponentType } from "react";
import { useLocation } from "wouter";
import { verifyAdminToken } from "@/lib/adminAuth";

interface ProtectedRouteProps {
  component: ComponentType;
}

export function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    verifyAdminToken().then((valid) => {
      if (!valid) {
        setLocation("/admin/login");
      } else {
        setAuthorized(true);
      }
      setChecking(false);
    });
  }, [setLocation]);

  if (checking) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </main>
    );
  }

  if (!authorized) return null;

  return <Component />;
}
