import HistoryPage from "@/features/departments/pages/history/page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  return (
    <HistoryPage
      params={Promise.resolve({ department: "safety" })}
      searchParams={searchParams}
    />
  );
}
