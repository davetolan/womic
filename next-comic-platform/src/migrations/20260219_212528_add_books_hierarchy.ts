import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "books" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DROP INDEX "chapters_chapter_number_idx";
  DROP INDEX "episodes_episode_number_idx";
  DROP INDEX "_episodes_v_version_version_episode_number_idx";
  ALTER TABLE "chapters" ADD COLUMN "book_id" integer NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "books_id" integer;
  CREATE UNIQUE INDEX "books_slug_idx" ON "books" USING btree ("slug");
  CREATE INDEX "books_updated_at_idx" ON "books" USING btree ("updated_at");
  CREATE INDEX "books_created_at_idx" ON "books" USING btree ("created_at");
  ALTER TABLE "chapters" ADD CONSTRAINT "chapters_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "chapters_book_idx" ON "chapters" USING btree ("book_id");
  CREATE INDEX "payload_locked_documents_rels_books_id_idx" ON "payload_locked_documents_rels" USING btree ("books_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "books" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "books" CASCADE;
  ALTER TABLE "chapters" DROP CONSTRAINT "chapters_book_id_books_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_books_fk";
  
  DROP INDEX "chapters_book_idx";
  DROP INDEX "payload_locked_documents_rels_books_id_idx";
  CREATE UNIQUE INDEX "chapters_chapter_number_idx" ON "chapters" USING btree ("chapter_number");
  CREATE UNIQUE INDEX "episodes_episode_number_idx" ON "episodes" USING btree ("episode_number");
  CREATE INDEX "_episodes_v_version_version_episode_number_idx" ON "_episodes_v" USING btree ("version_episode_number");
  ALTER TABLE "chapters" DROP COLUMN "book_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "books_id";`)
}
