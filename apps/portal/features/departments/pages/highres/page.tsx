import { SatelliteMonitoringDashboard } from "@/features/departments/components/satellite/SatelliteMonitoringDashboard";

export default function HighResPage({
  params: _params,
}: {
  params: Promise<{ department: string }>;
}) {
  return <SatelliteMonitoringDashboard defaultTab="highres" />;
}
