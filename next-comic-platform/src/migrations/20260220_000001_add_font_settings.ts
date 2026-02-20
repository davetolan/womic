import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN "default_font" varchar DEFAULT 'patrickHand';
    UPDATE "site_settings" SET "default_font" = 'patrickHand' WHERE "default_font" IS NULL;
    ALTER TABLE "site_settings" ALTER COLUMN "default_font" SET NOT NULL;

    ALTER TABLE "pages" ADD COLUMN "font_override" varchar DEFAULT 'default';
    ALTER TABLE "_pages_v" ADD COLUMN "version_font_override" varchar DEFAULT 'default';
    ALTER TABLE "posts" ADD COLUMN "font_override" varchar DEFAULT 'default';
    ALTER TABLE "_posts_v" ADD COLUMN "version_font_override" varchar DEFAULT 'default';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN "default_font";
    ALTER TABLE "pages" DROP COLUMN "font_override";
    ALTER TABLE "_pages_v" DROP COLUMN "version_font_override";
    ALTER TABLE "posts" DROP COLUMN "font_override";
    ALTER TABLE "_posts_v" DROP COLUMN "version_font_override";
  `)
}
