import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "newsletter_notices" ADD COLUMN "image_id" integer;
    ALTER TABLE "newsletter_notices" ADD COLUMN "appearance_background_color" varchar DEFAULT '#ffffff';
    ALTER TABLE "newsletter_notices" ADD COLUMN "appearance_text_color" varchar DEFAULT '#111827';
    ALTER TABLE "newsletter_notices" ADD COLUMN "appearance_button_color" varchar DEFAULT '#111827';
    ALTER TABLE "newsletter_notices" ADD COLUMN "appearance_button_text_color" varchar DEFAULT '#ffffff';
    ALTER TABLE "newsletter_notices" ADD COLUMN "appearance_cta_label" varchar DEFAULT 'Read now';

    ALTER TABLE "newsletter_notices"
      ADD CONSTRAINT "newsletter_notices_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX "newsletter_notices_image_idx" ON "newsletter_notices" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "newsletter_notices" DROP CONSTRAINT "newsletter_notices_image_id_media_id_fk";
    DROP INDEX "newsletter_notices_image_idx";

    ALTER TABLE "newsletter_notices" DROP COLUMN "image_id";
    ALTER TABLE "newsletter_notices" DROP COLUMN "appearance_background_color";
    ALTER TABLE "newsletter_notices" DROP COLUMN "appearance_text_color";
    ALTER TABLE "newsletter_notices" DROP COLUMN "appearance_button_color";
    ALTER TABLE "newsletter_notices" DROP COLUMN "appearance_button_text_color";
    ALTER TABLE "newsletter_notices" DROP COLUMN "appearance_cta_label";
  `)
}
