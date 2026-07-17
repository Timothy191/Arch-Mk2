import { SatelliteMonitoringDashboard } from "@/features/departments/components/satellite/SatelliteMonitoringDashboard";

export default function HyperspectralPage({
  params: _params,
}: {
  params: Promise<{ department: string }>;
}) {
  return <SatelliteMonitoringDashboard defaultTab="hyperspectral" />;
}
