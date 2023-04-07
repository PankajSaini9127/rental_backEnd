/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const  db = require('../db')
exports.seed = async function() {
  // Deletes ALL existing entries
  // await db('users').del()
  // await db('users').insert([
  //   {id: 1, email: 'andromeda@gmail.com',password:"andromeda2023",role:"Super Admin",name:"Andromeda"}
  // ]);
};
