import * as migration_20260219_033523 from './20260219_033523';
import * as migration_20260219_033706 from './20260219_033706';

export const migrations = [
  {
    up: migration_20260219_033523.up,
    down: migration_20260219_033523.down,
    name: '20260219_033523',
  },
  {
    up: migration_20260219_033706.up,
    down: migration_20260219_033706.down,
    name: '20260219_033706'
  },
];
