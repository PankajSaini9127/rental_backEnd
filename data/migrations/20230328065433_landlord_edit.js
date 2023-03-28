/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // return knex.table('landlords').renameColumn('percentageShare','percentage');
    return knex.schema.table ('landlords', function(table) {
        table.renameColumn('percentageShare', 'percentage')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('landlords')
};