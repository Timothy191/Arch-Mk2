import DepartmentPage from "@/features/departments/pages/hyperspectral/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "satellite-monitoring" })} />;
}
