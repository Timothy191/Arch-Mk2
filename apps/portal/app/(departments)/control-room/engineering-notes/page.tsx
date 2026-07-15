import DepartmentPage from "@/features/departments/pages/engineering-notes/page";

export default function Page() {
  return <DepartmentPage params={Promise.resolve({ department: "control-room" })} />;
}
