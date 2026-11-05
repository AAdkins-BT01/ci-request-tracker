import { and, desc, eq, isNull, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { requests } from "@/lib/db/schema";
import { FilterBar } from "@/components/FilterBar";
import { RequestTable } from "@/components/RequestTable";

type SearchParams = Promise<{
  status?: string;
  type?: string;
  department?: string;
  owner?: string;
  priority?: string;
}>;

export default async function ReviewDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const conditions: SQL[] = [];
  if (params.status) conditions.push(eq(requests.status, params.status as never));
  if (params.type) conditions.push(eq(requests.type, params.type as never));
  if (params.priority) conditions.push(eq(requests.priority, params.priority as never));
  if (params.department) conditions.push(eq(requests.department, params.department));
  if (params.owner === "unassigned") conditions.push(isNull(requests.owner));
  else if (params.owner) conditions.push(eq(requests.owner, params.owner as never));

  const [rows, departmentRows] = await Promise.all([
    db
      .select()
      .from(requests)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(requests.createdAt)),
    db.selectDistinct({ department: requests.department }).from(requests),
  ]);

  const departments = departmentRows.map((d) => d.department).sort();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Requests</h1>
        <p className="text-sm text-zinc-500">{rows.length} shown</p>
      </div>
      <FilterBar departments={departments} />
      <RequestTable requests={rows} />
    </div>
  );
}
