import DepartmentPage from "@/features/departments/pages/sar/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "satellite-monitoring" })} />;
}
