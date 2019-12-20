exports.up = function(knex) {
  return knex.schema.table('Task', function(table) {
    table.text('description');
  });
};

exports.down = function(knex) {
  knex.schema.table('Task', function(table) {
    table.dropColumn('description');
  });
};
