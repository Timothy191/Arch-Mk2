import { SatelliteMonitoringDashboard } from "@/features/departments/components/satellite/SatelliteMonitoringDashboard";

export default function SARPage({
  params: _params,
}: {
  params: Promise<{ department: string }>;
}) {
  return <SatelliteMonitoringDashboard defaultTab="sar" />;
}
