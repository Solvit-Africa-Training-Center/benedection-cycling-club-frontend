import type { Metadata } from "next";
import AdminGate from "@/components/admin/AdminGate";
import { AuthProvider } from "@/components/admin/AuthProvider";
import { ToastProvider } from "@/components/admin/Toast";

/**
 * Layout for every /admin/* route.
 *
 * Keeps the admin out of search results: the dashboard is private and indexing
 * it would leak the fact that this CMS exists.
 */
export const metadata: Metadata = {
  title: "Admin | Benediction Cycling Club",
  description: "Admin dashboard for the Benediction Cycling Club website.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminGate>{children}</AdminGate>
      </ToastProvider>
    </AuthProvider>
  );
}
