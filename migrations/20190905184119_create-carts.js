exports.up = function(knex) {
  return knex.schema.createTable("carts", table => {
    table.increments();
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .notNullable();
    table
      .integer("products_id")
      .references("id")
      .inTable("products")
      .notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("carts");
};
