exports.up = function(knex) {
  return knex.schema.table('MediaItem', function(table) {
    table.dropColumn('observation');
  });
};

exports.down = function(knex) {
  return knex.schema.table('MediaItem', function(table) {
    table.jsonb('observation');
  });
};
