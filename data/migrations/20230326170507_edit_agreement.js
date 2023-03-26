/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('agreements',t=>{
      t.string('year1').defaultTo(null)
      t.string('year2').defaultTo(null)
      t.string('year3').defaultTo(null)
      t.string('year4').defaultTo(null)
      t.string('year5').defaultTo(null)
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('agreements')
  };
  