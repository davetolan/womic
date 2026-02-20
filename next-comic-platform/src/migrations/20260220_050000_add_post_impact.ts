import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_posts_impact" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
    CREATE TYPE "public"."enum__posts_v_version_impact" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');

    ALTER TABLE "posts" ADD COLUMN "impact" "enum_posts_impact" DEFAULT 'lowImpact';
    ALTER TABLE "_posts_v" ADD COLUMN "version_impact" "enum__posts_v_version_impact" DEFAULT 'lowImpact';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" DROP COLUMN "impact";
    ALTER TABLE "_posts_v" DROP COLUMN "version_impact";

    DROP TYPE "public"."enum_posts_impact";
    DROP TYPE "public"."enum__posts_v_version_impact";
  `)
}
