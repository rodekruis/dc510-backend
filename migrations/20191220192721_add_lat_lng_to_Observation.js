exports.up = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.float('lat');
    table.float('lng');
  });
};

exports.down = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.dropColumn('lat');
    table.dropColumn('lng');
  });
};
