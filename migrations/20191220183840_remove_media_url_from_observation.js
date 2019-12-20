exports.up = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.dropColumn('media_url');
  });
};

exports.down = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.string('media_url');
  });
};
