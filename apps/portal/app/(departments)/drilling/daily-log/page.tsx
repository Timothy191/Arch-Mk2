import DepartmentPage from "@/features/departments/pages/daily-log/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "drilling" })} />;
}
