/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    { password: 'Admin',email:'Pankaj@test.com',role:"Manager",supervisor:"Pankaj",mobile:"8239879127"},
    { password: 'Admin',email:'Nilesh@test.com',role:"Manager",supervisor:"Nilesh",mobile:"8239879127"},
    { password: 'Admin',email:'Yashwant@test.com',role:"Manager",supervisor:"Yashwant",mobile:"8239879127"},
  ]);
};
