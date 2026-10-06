import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin CMS | Money Wise",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}
