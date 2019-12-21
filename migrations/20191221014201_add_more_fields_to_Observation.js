exports.up = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.float('marked_lat');
    table.float('marked_lng');
    table.timestamp('recordedAt_utc', { useTz: false });
    table.text('recordedAt_offset');
  });
};

exports.down = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.dropColumn('marked_lat');
    table.dropColumn('marked_lng');
    table.dropColumn('recordedAt_utc');
    table.dropColumn('recordedAt_offset');
  });
};
