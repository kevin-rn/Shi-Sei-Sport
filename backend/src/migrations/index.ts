import * as migration_20260215_224951___name from './20260215_224951___name';
import * as migration_20261125_223434_payload_3942_schema_sync from './20261125_223434_payload_3942_schema_sync';

export const migrations = [
  {
    up: migration_20260215_224951___name.up,
    down: migration_20260215_224951___name.down,
    name: '20260215_224951___name',
  },
  {
    up: migration_20261125_223434_payload_3942_schema_sync.up,
    down: migration_20261125_223434_payload_3942_schema_sync.down,
    name: '20261125_223434_payload_3942_schema_sync'
  },
];
