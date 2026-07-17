import DepartmentDashboard from "@/features/departments/dashboard";

export default function Page() {
  return <DepartmentDashboard params={Promise.resolve({ department: "control-room" })} />;
}
