import DepartmentRootLayout from "@/features/departments/layout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DepartmentRootLayout params={Promise.resolve({ department: "control-room" })}>
      {children}
    </DepartmentRootLayout>
  );
}
