import * as migration_20260219_033523 from './20260219_033523';
import * as migration_20260219_033706 from './20260219_033706';
import * as migration_20260219_212528_add_books_hierarchy from './20260219_212528_add_books_hierarchy';

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
    name: '20260219_212528_add_books_hierarchy'
  },
];
