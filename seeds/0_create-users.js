exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { email: "kevinguo@devleague.com", password: "password1" },
        { email: "ed@devleague.com", password: "password2" },
        { email: "mel@devleague.com", password: "password3" }
      ]);
    });
};
