import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      enum_name text;
      font_value text;
      enum_names text[] := ARRAY[
        'enum_site_settings_default_font',
        'enum_pages_font_override',
        'enum__pages_v_version_font_override',
        'enum_posts_font_override',
        'enum__posts_v_version_font_override'
      ];
      font_values text[] := ARRAY[
        'roboto',
        'openSans',
        'lato',
        'montserrat',
        'oswald',
        'sourceSans3',
        'raleway',
        'poppins',
        'merriweather',
        'nunito'
      ];
    BEGIN
      FOREACH enum_name IN ARRAY enum_names LOOP
        IF EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_namespace n ON n.oid = t.typnamespace
          WHERE n.nspname = 'public'
            AND t.typname = enum_name
        ) THEN
          FOREACH font_value IN ARRAY font_values LOOP
            EXECUTE format('ALTER TYPE %I.%I ADD VALUE IF NOT EXISTS %L', 'public', enum_name, font_value);
          END LOOP;
        END IF;
      END LOOP;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1;`)
}
