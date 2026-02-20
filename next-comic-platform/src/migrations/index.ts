import * as migration_20260219_033523 from './20260219_033523';
import * as migration_20260219_033706 from './20260219_033706';
import * as migration_20260219_212528_add_books_hierarchy from './20260219_212528_add_books_hierarchy';
import * as migration_20260219_235204_add_header_footer_height from './20260219_235204_add_header_footer_height';
import * as migration_20260220_000001_add_font_settings from './20260220_000001_add_font_settings';
import * as migration_20260220_003000_ensure_font_columns from './20260220_003000_ensure_font_columns';
import * as migration_20260220_030504_add_newsletter_signup_block_tables from './20260220_030504_add_newsletter_signup_block_tables';
import * as migration_20260220_032111_add_newsletter_signup_customization_fields from './20260220_032111_add_newsletter_signup_customization_fields';

export const migrations = [
  {
    up: migration_20260219_033523.up,
    down: migration_20260219_033523.down,
    name: '20260219_033523',
  },
  {
    up: migration_20260219_033706.up,
    down: migration_20260219_033706.down,
    name: '20260219_033706',
  },
  {
    up: migration_20260219_212528_add_books_hierarchy.up,
    down: migration_20260219_212528_add_books_hierarchy.down,
    name: '20260219_212528_add_books_hierarchy',
  },
  {
    up: migration_20260219_235204_add_header_footer_height.up,
    down: migration_20260219_235204_add_header_footer_height.down,
    name: '20260219_235204_add_header_footer_height',
  },
  {
    up: migration_20260220_000001_add_font_settings.up,
    down: migration_20260220_000001_add_font_settings.down,
    name: '20260220_000001_add_font_settings',
  },
  {
    up: migration_20260220_003000_ensure_font_columns.up,
    down: migration_20260220_003000_ensure_font_columns.down,
    name: '20260220_003000_ensure_font_columns',
  },
  {
    up: migration_20260220_030504_add_newsletter_signup_block_tables.up,
    down: migration_20260220_030504_add_newsletter_signup_block_tables.down,
    name: '20260220_030504_add_newsletter_signup_block_tables',
  },
  {
    up: migration_20260220_032111_add_newsletter_signup_customization_fields.up,
    down: migration_20260220_032111_add_newsletter_signup_customization_fields.down,
    name: '20260220_032111_add_newsletter_signup_customization_fields'
  },
];
