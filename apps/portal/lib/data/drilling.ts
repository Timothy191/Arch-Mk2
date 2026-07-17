import "server-only";

import { createKyselyClient } from "@repo/supabase/kysely";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "../cache/tags";
import { getOperationalToday } from "@repo/utils";

const db = createKyselyClient();

interface TelemetryRecord {
  period: string;
  machine_id: string;
  machine_name: string;
  avg_engine_rpm: number | null;
  avg_engine_temp: number | null;
  avg_hydraulic_pressure: number | null;
  max_bit_depth: number | null;
  max_hole_depth: number | null;
  avg_penetration_rate: number | null;
  total_alerts: number;
  record_count: number;
}

interface ArchivedMonth {
  id: string;
  year_month: string;
  machine_name: string;
  archived_at: string;
  record_count: number;
}

interface DrillMonthlySummary {
  machine_id: string;
  machine_name: string;
  scheduled_hours: number | null;
  downtime_hours: number | null;
  productive_hours: number | null;
  availability_pct: number | null;
  utilization_pct: number | null;
}

export async function getDrillingOpsData(deptId: string) {
  "use cache: remote";
  cacheTag(
    CACHE_TAGS.drillOperations,
    CACHE_TAGS.machines,
    CACHE_TAGS.employees,
  );
  cacheLife("minutes");

  const today = getOperationalToday();

  const [drills, ops, operators] = await Promise.all([
    db
      .selectFrom("machines")
      .select(["id", "name"])
      .where("machine_type", "=", "Drill Rig")
      .where("active", "=", true as any)
      .orderBy("name")
      .execute(),
    db
      .selectFrom("drill_operations" as any)
      .select([
        "id",
        "machine_id",
        "shift_type",
        "operation_date",
        "open_hours",
        "close_hours",
        "total_hours",
        "operator_name",
        "block_drilled",
        "site",
        "external_delays_minutes",
        "standard_delays_hours",
        "production_delays_minutes",
        "engineering_delays_hours",
        "comments",
        "status",
      ] as any[])
      .where("department_id" as any, "=", deptId)
      .where("operation_date" as any, "=", today)
      .execute(),
    db
      .selectFrom("employees" as any)
      .select(["id" as any, "full_name" as any])
      .where("department_id" as any, "=", deptId)
      .orderBy("full_name" as any)
      .execute(),
  ]);

  return {
    drills: (drills as { id: string; name: string }[]) ?? [],
    ops: (ops as any[]) ?? [],
    operators: (operators as any[]) ?? [],
    deptId,
  };
}

export async function getMachineTelemetryData(
  deptId: string,
  selectedMachineId?: string,
): Promise<{
  currentMonth: string;
  telemetry: TelemetryRecord[];
  archives: ArchivedMonth[];
  drills: { id: string; name: string }[];
  monthlySummary: DrillMonthlySummary[];
}> {
  "use cache: remote";
  cacheTag(
    CACHE_TAGS.machineTelemetry,
    CACHE_TAGS.drillOperations,
    CACHE_TAGS.machines,
  );
  cacheLife("minutes");

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [drills, telemetry, archives, allMachines, monthlySummary] =
    await Promise.all([
      db
        .selectFrom("machines")
        .select(["id", "name"])
        .where("machine_type", "=", "Drill Rig")
        .where("active", "=", true as any)
        .orderBy("name")
        .execute(),
      db
        .selectFrom("get_telemetry_summary" as any)
        .selectAll()
        .where("p_department_id" as any, "=", deptId)
        .where("p_machine_id" as any, "=", selectedMachineId || null)
        .where("p_granularity" as any, "=", "day")
        .execute(),
      db
        .selectFrom("machine_telemetry_archive" as any)
        .select(["id", "year_month", "archived_at", "record_count", "machine_id"] as any[])
        .where("department_id" as any, "=", deptId)
        .orderBy("archived_at" as any, "desc")
        .limit(12)
        .execute(),
      db
        .selectFrom("machines")
        .select(["id", "name"])
        .where("machine_type", "=", "Drill Rig")
        .execute(),
      db
        .selectFrom("get_drill_monthly_summary" as any)
        .selectAll()
        .where("p_department_id" as any, "=", deptId)
        .where("p_year_month" as any, "=", currentMonth)
        .execute(),
    ]);

  const machineNameMap = new Map(
    ((allMachines as any[]) || []).map((m: { id: string; name: string }) => [
      m.id,
      m.name,
    ]),
  );

  const transformedArchives: ArchivedMonth[] = (archives || []).map(
    (a: any) => ({
      id: a.id,
      year_month: a.year_month,
      machine_name: machineNameMap.get(a.machine_id) || "Unknown",
      archived_at: a.archived_at,
      record_count: a.record_count,
    }),
  );

  return {
    currentMonth,
    telemetry: (telemetry || []) as TelemetryRecord[],
    archives: transformedArchives,
    drills: (drills as any[]) || [],
    monthlySummary: (monthlySummary || []) as DrillMonthlySummary[],
  };
}