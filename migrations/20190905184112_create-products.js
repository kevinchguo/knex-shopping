exports.up = function(knex) {
  return knex.schema.createTable("products", table => {
    table.increments();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.integer("inventory").notNullable();
    table.decimal("price").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("products");
};
