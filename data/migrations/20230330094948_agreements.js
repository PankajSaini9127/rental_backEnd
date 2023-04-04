/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('agreements',t=>{
      t.increments('id').primary(),
      t.string('code').notNullable(),
      t.string('leeseName').notNullable(),
      t.string('state').notNullable(),
      t.string('city').notNullable(),
      t.string('location').notNullable(),
      t.string('pincode').notNullable(),
      t.string('address').notNullable(),
      t.string('aadharNo').notNullable(),
      t.string('panNo').notNullable(),
      t.string('gstNo').notNullable(),
      t.string('mobileNo').notNullable(),
      t.string('alternateMobile').notNullable(),
      t.string('email').notNullable(),
      t.string('lockInYear').notNullable(),
      t.string('noticePeriod').notNullable(),
      t.string('deposite').notNullable(),
      t.string('monthlyRent').notNullable(),
      t.string('yearlyIncrement').notNullable(),
      t.string('bankName').notNullable(),
      t.string('benificiaryName').notNullable(),
      t.string('accountNo').notNullable(),
      t.string('ifscCode').notNullable(),
      t.string('status').defaultTo('Pending'),
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