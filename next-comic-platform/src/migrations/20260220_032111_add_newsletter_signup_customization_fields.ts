import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_newsletter_signup_layout_section_width" AS ENUM('default', 'narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_signup_layout_text_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_signup_layout_form_layout" AS ENUM('row', 'stacked');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_signup_layout_padding" AS ENUM('compact', 'default', 'spacious');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_signup_layout_corner_style" AS ENUM('rounded', 'pill', 'square');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_signup_layout_section_width" AS ENUM('default', 'narrow', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_signup_layout_text_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_signup_layout_form_layout" AS ENUM('row', 'stacked');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_signup_layout_padding" AS ENUM('compact', 'default', 'spacious');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_signup_layout_corner_style" AS ENUM('rounded', 'pill', 'square');
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "labels_email_placeholder" varchar DEFAULT 'you@example.com';
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "labels_submit_label" varchar DEFAULT 'Notify Me';
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "labels_submitting_label" varchar DEFAULT 'Submitting...';
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "labels_success_message" varchar DEFAULT 'Subscribed successfully.';
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "labels_error_message" varchar DEFAULT 'Something went wrong. Please try again.';
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "layout_section_width" "enum_pages_blocks_newsletter_signup_layout_section_width" DEFAULT 'default';
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "layout_text_alignment" "enum_pages_blocks_newsletter_signup_layout_text_alignment" DEFAULT 'left';
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "layout_form_layout" "enum_pages_blocks_newsletter_signup_layout_form_layout" DEFAULT 'row';
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "layout_padding" "enum_pages_blocks_newsletter_signup_layout_padding" DEFAULT 'default';
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "layout_corner_style" "enum_pages_blocks_newsletter_signup_layout_corner_style" DEFAULT 'rounded';
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "background_media_id" integer;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "background_style_show_overlay" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "background_style_overlay_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "background_style_overlay_opacity" numeric DEFAULT 30;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "colors_card_background_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "colors_text_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "colors_muted_text_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "colors_border_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "colors_input_background_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "colors_input_text_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "colors_input_border_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "colors_button_background_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "colors_button_text_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "colors_success_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD COLUMN "colors_error_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "labels_email_placeholder" varchar DEFAULT 'you@example.com';
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "labels_submit_label" varchar DEFAULT 'Notify Me';
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "labels_submitting_label" varchar DEFAULT 'Submitting...';
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "labels_success_message" varchar DEFAULT 'Subscribed successfully.';
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "labels_error_message" varchar DEFAULT 'Something went wrong. Please try again.';
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "layout_section_width" "enum__pages_v_blocks_newsletter_signup_layout_section_width" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "layout_text_alignment" "enum__pages_v_blocks_newsletter_signup_layout_text_alignment" DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "layout_form_layout" "enum__pages_v_blocks_newsletter_signup_layout_form_layout" DEFAULT 'row';
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "layout_padding" "enum__pages_v_blocks_newsletter_signup_layout_padding" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "layout_corner_style" "enum__pages_v_blocks_newsletter_signup_layout_corner_style" DEFAULT 'rounded';
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "background_media_id" integer;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "background_style_show_overlay" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "background_style_overlay_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "background_style_overlay_opacity" numeric DEFAULT 30;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "colors_card_background_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "colors_text_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "colors_muted_text_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "colors_border_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "colors_input_background_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "colors_input_text_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "colors_input_border_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "colors_button_background_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "colors_button_text_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "colors_success_color" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD COLUMN "colors_error_color" varchar;
  ALTER TABLE "pages_blocks_newsletter_signup" ADD CONSTRAINT "pages_blocks_newsletter_signup_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter_signup" ADD CONSTRAINT "_pages_v_blocks_newsletter_signup_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_newsletter_signup_background_media_idx" ON "pages_blocks_newsletter_signup" USING btree ("background_media_id");
  CREATE INDEX "_pages_v_blocks_newsletter_signup_background_media_idx" ON "_pages_v_blocks_newsletter_signup" USING btree ("background_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_newsletter_signup" DROP CONSTRAINT "pages_blocks_newsletter_signup_background_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP CONSTRAINT "_pages_v_blocks_newsletter_signup_background_media_id_media_id_fk";
  
  DROP INDEX "pages_blocks_newsletter_signup_background_media_idx";
  DROP INDEX "_pages_v_blocks_newsletter_signup_background_media_idx";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "labels_email_placeholder";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "labels_submit_label";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "labels_submitting_label";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "labels_success_message";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "labels_error_message";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "layout_section_width";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "layout_text_alignment";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "layout_form_layout";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "layout_padding";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "layout_corner_style";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "background_media_id";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "background_style_show_overlay";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "background_style_overlay_color";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "background_style_overlay_opacity";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "colors_card_background_color";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "colors_text_color";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "colors_muted_text_color";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "colors_border_color";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "colors_input_background_color";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "colors_input_text_color";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "colors_input_border_color";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "colors_button_background_color";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "colors_button_text_color";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "colors_success_color";
  ALTER TABLE "pages_blocks_newsletter_signup" DROP COLUMN "colors_error_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "labels_email_placeholder";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "labels_submit_label";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "labels_submitting_label";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "labels_success_message";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "labels_error_message";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "layout_section_width";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "layout_text_alignment";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "layout_form_layout";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "layout_padding";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "layout_corner_style";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "background_media_id";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "background_style_show_overlay";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "background_style_overlay_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "background_style_overlay_opacity";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "colors_card_background_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "colors_text_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "colors_muted_text_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "colors_border_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "colors_input_background_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "colors_input_text_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "colors_input_border_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "colors_button_background_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "colors_button_text_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "colors_success_color";
  ALTER TABLE "_pages_v_blocks_newsletter_signup" DROP COLUMN "colors_error_color";
  DROP TYPE "public"."enum_pages_blocks_newsletter_signup_layout_section_width";
  DROP TYPE "public"."enum_pages_blocks_newsletter_signup_layout_text_alignment";
  DROP TYPE "public"."enum_pages_blocks_newsletter_signup_layout_form_layout";
  DROP TYPE "public"."enum_pages_blocks_newsletter_signup_layout_padding";
  DROP TYPE "public"."enum_pages_blocks_newsletter_signup_layout_corner_style";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_signup_layout_section_width";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_signup_layout_text_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_signup_layout_form_layout";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_signup_layout_padding";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_signup_layout_corner_style";`)
}
