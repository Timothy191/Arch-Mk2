import DepartmentPage from "@/features/departments/pages/breakdowns/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "engineering" })} />;
}
