import DepartmentPage from "@/features/departments/pages/hourly-loads/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "production" })} />;
}
