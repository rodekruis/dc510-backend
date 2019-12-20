exports.up = function(knex) {
  return knex.schema
    .withSchema('public')
    .createTable('MediaItem', function(table) {
      table.increments();
      table.timestamp('createdAt_utc', { useTz: false });
      table.timestamp('updatedAt_utc', { useTz: false });
      table.text('createdAt_offset');
      table.text('updatedAt_offset');
      table.integer('createdBy');
      table.integer('updatedBy');
      table.text('url');
      table.integer('observation');
      table.index('observation');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('MediaItem');
};
