exports.up = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.dropColumn('location');
  });
};

exports.down = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.jsonb('location');
  });
};
