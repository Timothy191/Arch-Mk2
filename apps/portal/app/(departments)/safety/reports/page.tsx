import ReportsPage from "@/features/departments/pages/reports/page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  return (
    <ReportsPage
      params={Promise.resolve({ department: "safety" })}
      searchParams={searchParams}
    />
  );
}
