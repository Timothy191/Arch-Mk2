import DepartmentPage from "@/features/departments/pages/tools/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "safety" })} />;
}
