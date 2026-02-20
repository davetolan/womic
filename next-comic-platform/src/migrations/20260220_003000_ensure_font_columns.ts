import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "site_settings" ADD COLUMN IF NOT EXISTS "default_font" varchar DEFAULT 'patrickHand';
    ALTER TABLE IF EXISTS "pages" ADD COLUMN IF NOT EXISTS "font_override" varchar DEFAULT 'default';
    ALTER TABLE IF EXISTS "_pages_v" ADD COLUMN IF NOT EXISTS "version_font_override" varchar DEFAULT 'default';
    ALTER TABLE IF EXISTS "posts" ADD COLUMN IF NOT EXISTS "font_override" varchar DEFAULT 'default';
    ALTER TABLE IF EXISTS "_posts_v" ADD COLUMN IF NOT EXISTS "version_font_override" varchar DEFAULT 'default';

    DO $$
    BEGIN
      IF to_regclass('public.site_settings') IS NOT NULL THEN
        UPDATE "site_settings" SET "default_font" = 'patrickHand' WHERE "default_font" IS NULL;
        ALTER TABLE "site_settings" ALTER COLUMN "default_font" SET NOT NULL;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "_posts_v" DROP COLUMN IF EXISTS "version_font_override";
    ALTER TABLE IF EXISTS "posts" DROP COLUMN IF EXISTS "font_override";
    ALTER TABLE IF EXISTS "_pages_v" DROP COLUMN IF EXISTS "version_font_override";
    ALTER TABLE IF EXISTS "pages" DROP COLUMN IF EXISTS "font_override";
    ALTER TABLE IF EXISTS "site_settings" DROP COLUMN IF EXISTS "default_font";
  `)
}
