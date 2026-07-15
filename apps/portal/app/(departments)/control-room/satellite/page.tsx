import DepartmentPage from "@/features/departments/pages/satellite/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "control-room" })} />;
}
