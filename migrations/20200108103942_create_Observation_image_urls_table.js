exports.up = function(knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Observation_image_urls', function(table) {
      table.increments();
      table.integer('MediaItem_id');
      table.integer('Observation_id');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Observation_image_urls');
};
