/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('agreements',t=>{
    t.increments('id').primary(),
    t.string('code'),
    t.string('lockInYear'),
    t.string('noticePeriod'),
    t.string('deposite'),
    t.string('monthlyRent'),
    t.string('yearlyIncrement'),
    t.string('status').defaultTo('Pending'),
    t.string('gst_certificate'),
    t.string('draft_agreement'),
    t.string('electricity_bill'),
    t.string('poa'),
    t.string('maintaince_bill'),
    t.string('cheque'),
    t.string('tax_receipt'),
    t.string('noc'),
    t.timestamp('time')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('agreements')
};
