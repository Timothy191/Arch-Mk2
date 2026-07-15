import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { db } from "@repo/database";
import { adminDataUpdateSchema } from "../common/schemas";

const OPERATIONAL_TABLES = new Set([
  "machines",
  "daily_logs",
  "machine_hours",
  "fuel_logs",
  "production_logs",
  "machine_operations",
  "hourly_loads",
  "operational_delays",
  "engineering_notes",
  "shift_status",
  "excavator_activity",
  "excavator_dumper_assignments",
  "dozer_rolls",
  "breakdowns",
  "safety_incidents",
  "drill_operations",
  "documents",
  "document_versions",
  "machine_configurations",
  "operators",
  "sites",
  "mine_blocks",
  "delay_categories",
  "report_templates",
  "safety_severities",
  "safety_incident_categories",
  "generated_reports",
  "personnel",
  "visitors",
  "badges",
  "fleet",
  "equipment",
  "access_logs",
]);

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  validateTable(table: string): string {
    const normalized = table.toLowerCase();
    if (!OPERATIONAL_TABLES.has(normalized)) {
      throw new NotFoundException("Unknown table");
    }
    return normalized;
  }

  async getData(
    table: string,
    limit: number,
    offset: number,
    orderBy: string,
    orderDir: "asc" | "desc",
  ) {
    const { data, count } = await db
      .selectFrom(table)
      .select("*")
      .orderBy(orderBy, orderDir === "asc" ? "asc" : "desc")
      .limit(limit)
      .offset(offset)
      .execute();

    return { data: data ?? [], count: count ?? 0, limit, offset };
  }

  async updateData(
    table: string,
    body: { id: string; data: Record<string, unknown> },
    employeeId: string,
  ) {
    const parsed = adminDataUpdateSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const { id, data } = parsed.data;
    if (!id) {
      throw new BadRequestException("Missing record id");
    }

    // Get before state for audit
    const { data: before } = await db
      .selectFrom(table)
      .select("*")
      .where("id", "=", id)
      .execute();

    const { error } = await db
      .updateTable(table)
      .set(data)
      .where("id", "=", id)
      .execute();

    if (error) {
      this.logger.error("Update failed", error.message);
      throw new Error("Update failed");
    }

    await db
      .insertInto("audit_logs")
      .values({
        action: "update",
        table_name: table,
        record_id: id,
        old_data: before ?? null,
        new_data: data,
        performed_by: employeeId,
      })
      .execute();

    return { success: true };
  }

  async deleteData(table: string, id: string, employeeId: string) {
    if (!id) {
      throw new BadRequestException("Missing id query parameter");
    }

    // Get before state for audit
    const { data: before } = await db
      .selectFrom(table)
      .select("*")
      .where("id", "=", id)
      .execute();

    const { error } = await db
      .deleteFrom(table)
      .where("id", "=", id)
      .execute();

    if (error) {
      this.logger.error("Delete failed", error.message);
      throw new Error("Delete failed");
    }

    await db
      .insertInto("audit_logs")
      .values({
        action: "delete",
        table_name: table,
        record_id: id,
        old_data: before ?? null,
        performed_by: employeeId,
      })
      .execute();

    return { success: true };
  }

  async assertAdmin(userId: string) {
    const { data: employee } = await db
      .selectFrom("employees")
      .select(["id", "role"])
      .where("auth_id", "=", userId)
      .execute();

    if (!employee || employee.role !== "admin") {
      throw new ForbiddenException("Forbidden");
    }

    return employee;
  }
}