exports.up = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.jsonb('image_urls');
  });
};

exports.down = function(knex) {
  return knex.schema.table('Observation', function(table) {
    table.dropColumn('image_urls');
  });
};
