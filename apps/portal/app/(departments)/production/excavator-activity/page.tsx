import DepartmentPage from "@/features/departments/pages/excavator-activity/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "production" })} />;
}
