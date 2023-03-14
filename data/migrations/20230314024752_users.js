/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users',table=>{
        table.increments('id').primary(),
        table.string('name').notNullable(),
        table.string('code').notNullable(),
        table.string('password').notNullable(),
        table.string('email').notNullable().unique(),
        table.string('mobile').notNullable(),
        table.string('role').notNullable(),
        table.string('supervisor').notNullable(),
        table.timestamp('time')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.schema.dropTable('users')
};
