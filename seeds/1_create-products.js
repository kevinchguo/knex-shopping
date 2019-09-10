exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("products")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("products").insert([
        {
          title: "Product 1",
          description: "I am product 1",
          inventory: 111,
          price: 11.11
        },
        {
          title: "Product 2",
          description: "I am product 2",
          inventory: 222,
          price: 22.22
        },
        {
          title: "Product 3",
          description: "I am product 3",
          inventory: 333,
          price: 33.33
        }
      ]);
    });
};
