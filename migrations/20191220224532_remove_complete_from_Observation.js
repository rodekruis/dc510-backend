exports.up = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.dropColumn('complete');
  });
};

exports.down = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.boolean('complete');
  });
};
