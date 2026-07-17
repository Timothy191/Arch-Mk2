import DepartmentPage from "@/features/departments/pages/machines/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "safety" })} />;
}
