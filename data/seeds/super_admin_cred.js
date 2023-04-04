/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const  db = require('../db')
exports.seed = async function() {
  // Deletes ALL existing entries
  // await db('super_admin_creds').del()
  // await db('super_admin_creds').insert([
  //   {id: 1, email: 'andromeda@gmail.com',password:"andromeda2023",role:"Super Admin",name:"Andromeda"}
  // ]);
};
