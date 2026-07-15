import DepartmentPage from "@/features/departments/pages/operational-delays/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "drilling" })} />;
}
