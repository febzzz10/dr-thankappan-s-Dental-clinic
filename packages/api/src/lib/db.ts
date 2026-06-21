export async function all<T>(
  db: D1Database,
  sql: string,
  bindings?: unknown[]
): Promise<T[]> {
  const { results } = await db.prepare(sql).bind(...(bindings ?? [])).all<T>();
  return results;
}

export async function get<T>(
  db: D1Database,
  sql: string,
  bindings?: unknown[]
): Promise<T | null> {
  const result = await db.prepare(sql).bind(...(bindings ?? [])).first<T>();
  return result ?? null;
}

export async function run(
  db: D1Database,
  sql: string,
  bindings?: unknown[]
): Promise<D1Result> {
  return db.prepare(sql).bind(...(bindings ?? [])).run();
}

export async function batch(
  db: D1Database,
  statements: { sql: string; bindings?: unknown[] }[]
): Promise<D1Result[]> {
  const stmts = statements.map(s =>
    db.prepare(s.sql).bind(...(s.bindings ?? []))
  );
  return db.batch(stmts);
}
