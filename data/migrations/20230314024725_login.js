/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.schema.createTable('login',(table)=>{
      table.increments('id').primary(),
      table.string('email').notNullable().unique(),
      table.string('password').notNullable(),
      table.string('role').notNullable(),
      table.timestamp('time')
   })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.schema.dropTable('login')
};
