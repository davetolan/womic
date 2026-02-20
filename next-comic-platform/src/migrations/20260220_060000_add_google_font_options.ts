import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const addEnumValueIfMissing = (enumName: string, value: string) => sql`
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_type t
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
        AND t.typname = ${enumName}
    ) AND NOT EXISTS (
      SELECT 1
      FROM pg_type t
      JOIN pg_enum e ON e.enumtypid = t.oid
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
        AND t.typname = ${enumName}
        AND e.enumlabel = ${value}
    ) THEN
      EXECUTE format('ALTER TYPE %I.%I ADD VALUE %L', 'public', ${enumName}, ${value});
    END IF;
  END $$;
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const fonts = [
    'roboto',
    'openSans',
    'lato',
    'montserrat',
    'oswald',
    'sourceSans3',
    'raleway',
    'poppins',
    'merriweather',
    'nunito',
  ]

  const enumNames = [
    'enum_site_settings_default_font',
    'enum_pages_font_override',
    'enum__pages_v_version_font_override',
    'enum_posts_font_override',
    'enum__posts_v_version_font_override',
  ]

  for (const enumName of enumNames) {
    for (const font of fonts) {
      await db.execute(addEnumValueIfMissing(enumName, font))
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1;`)
}
