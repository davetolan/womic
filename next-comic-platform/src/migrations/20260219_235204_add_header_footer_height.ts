import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header" ADD COLUMN "style_height" varchar;
    ALTER TABLE "footer" ADD COLUMN "style_height" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header" DROP COLUMN "style_height";
    ALTER TABLE "footer" DROP COLUMN "style_height";
  `)
}
