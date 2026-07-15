import DepartmentPage from "@/features/departments/pages/machine-operations/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "drilling" })} />;
}
