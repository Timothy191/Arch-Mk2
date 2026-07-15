import DepartmentPage from "@/features/departments/pages/roll-over/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "drilling" })} />;
}
