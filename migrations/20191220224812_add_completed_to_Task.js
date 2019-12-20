exports.up = function(knex) {
  return knex.schema.table('Task', function(table) {
    table.boolean('completed');
  });
};

exports.down = function(knex) {
  return knex.schema.table('Task', function(table) {
    table.dropColumn('completed');
  });
};
