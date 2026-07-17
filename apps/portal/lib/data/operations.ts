import "server-only";

import { cacheTag, cacheLife } from "next/cache";
import { createKyselyClient } from "@repo/supabase/kysely";
import { CACHE_TAGS } from "@/lib/cache/tags";

const db = createKyselyClient();

export async function getControlRoomSummary(deptId: string, today: string) {
  "use cache: remote";
  cacheTag(
    CACHE_TAGS.machineOperations,
    CACHE_TAGS.operationalDelays,
    CACHE_TAGS.hourlyLoads,
    CACHE_TAGS.machines,
  );
  cacheLife({ expire: 300 });

  const [todayLogs, machines] = await Promise.all([
    db
      .selectFrom("daily_logs")
      .select(["id", "log_date", "shift"])
      .where("department_id", "=", deptId)
      .where("log_date", "=", today)
      .orderBy("shift")
      .execute(),
    db
      .selectFrom("machines")
      .select(["id", "name", "machine_type", "active"])
      .where("active", "=", true as any)
      .execute(),
  ]);

  return {
    todayOperations: todayLogs ?? [],
    todayDelays: [],
    todayLoads: [],
    machineCount: machines.length ?? 0,
  };
}

export async function getNonControlRoomSummary(deptId: string, today: string) {
  "use cache: remote";
  cacheTag(CACHE_TAGS.dailyLogs, CACHE_TAGS.machines);
  cacheLife({ expire: 300 });

  const [todayLogs, machines] = await Promise.all([
    db
      .selectFrom("daily_logs")
      .select(["id", "log_date", "shift"])
      .where("department_id", "=", deptId)
      .where("log_date", "=", today)
      .orderBy("shift")
      .execute(),
    db
      .selectFrom("machines")
      .select(["id", "name", "machine_type", "active"])
      .where("active", "=", true as any)
      .execute(),
  ]);

  return {
    todayLogs: todayLogs ?? [],
    machineCount: machines.length ?? 0,
  };
}

export async function getShiftCoverageLogs(deptId: string, today: string) {
  "use cache: remote";
  cacheTag(CACHE_TAGS.dailyLogs);
  cacheLife({ expire: 300 });

  const result = await db
    .selectFrom("daily_logs")
    .select(["id", "log_date", "shift"])
    .where("department_id", "=", deptId)
    .where("log_date", "=", today)
    .orderBy("shift")
    .execute();

  return result ?? [];
}