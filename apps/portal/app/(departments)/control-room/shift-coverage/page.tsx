import DepartmentPage from "@/features/departments/pages/shift-coverage/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "control-room" })} />;
}
