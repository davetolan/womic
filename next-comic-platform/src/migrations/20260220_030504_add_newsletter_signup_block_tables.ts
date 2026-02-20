import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_font_override" AS ENUM('default', 'patrickHand', 'inter', 'lora', 'spectral');
  CREATE TYPE "public"."enum__pages_v_version_font_override" AS ENUM('default', 'patrickHand', 'inter', 'lora', 'spectral');
  CREATE TYPE "public"."enum_posts_font_override" AS ENUM('default', 'patrickHand', 'inter', 'lora', 'spectral');
  CREATE TYPE "public"."enum__posts_v_version_font_override" AS ENUM('default', 'patrickHand', 'inter', 'lora', 'spectral');
  CREATE TYPE "public"."enum_site_settings_default_font" AS ENUM('patrickHand', 'inter', 'lora', 'spectral');
  CREATE TABLE "pages_blocks_newsletter_signup" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Newsletter',
  	"description" varchar DEFAULT 'Get notified when a new episode drops.',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter_signup" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Newsletter',
  	"description" varchar DEFAULT 'Get notified when a new episode drops.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "header" ALTER COLUMN "cta_link_link_label" DROP NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "font_override" "enum_pages_font_override" DEFAULT 'default';
  ALTER TABLE "_pages_v" ADD COLUMN "version_font_override" "enum__pages_v_version_font_override" DEFAULT 'default';
  ALTER TABLE "posts" ADD COLUMN "font_override" "enum_posts_font_override" DEFAULT 'default';
  ALTER TABLE "_posts_v" ADD COLUMN "version_font_override" "enum__posts_v_version_font_override" DEFAULT 'default';
  ALTER TABLE "site_settings" ADD COLUMN "default_font" "enum_site_settings_default_font" DEFAULT 'patrickHand' NOT NULL;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD CONSTRAINT "pages_blocks_newsletter_signup_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD CONSTRAINT "_pages_v_blocks_newsletter_signup_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_newsletter_signup_order_idx" ON "pages_blocks_newsletter_signup" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_signup_parent_id_idx" ON "pages_blocks_newsletter_signup" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_signup_path_idx" ON "pages_blocks_newsletter_signup" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_newsletter_signup_order_idx" ON "_pages_v_blocks_newsletter_signup" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_signup_parent_id_idx" ON "_pages_v_blocks_newsletter_signup" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_signup_path_idx" ON "_pages_v_blocks_newsletter_signup" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_newsletter_signup" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_newsletter_signup" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter_signup" CASCADE;
  ALTER TABLE "header" ALTER COLUMN "cta_link_link_label" SET NOT NULL;
  ALTER TABLE "pages" DROP COLUMN "font_override";
  ALTER TABLE "_pages_v" DROP COLUMN "version_font_override";
  ALTER TABLE "posts" DROP COLUMN "font_override";
  ALTER TABLE "_posts_v" DROP COLUMN "version_font_override";
  ALTER TABLE "site_settings" DROP COLUMN "default_font";
  DROP TYPE "public"."enum_pages_font_override";
  DROP TYPE "public"."enum__pages_v_version_font_override";
  DROP TYPE "public"."enum_posts_font_override";
  DROP TYPE "public"."enum__posts_v_version_font_override";
  DROP TYPE "public"."enum_site_settings_default_font";`)
}
