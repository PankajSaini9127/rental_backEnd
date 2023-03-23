/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("landlords",(t)=>{
        t.increments('id').primary(),
        t.string('name'),
        t.string('percentageShare'),
        t.string('leeseName'),
        t.string('state'),
        t.string('city'),
        t.string('location'),
        t.string('pincode'),
        t.string('address'),
        t.string('aadharNo'),
        t.string('panNo'),
        t.string('gstNo'),
        t.string('mobileNo'),
        t.string('alternateMobile'),
        t.string('email'),
        t.string("bankName"),
        t.string("benificiaryName"),
        t.string("accountNo"),
        t.string("ifscCode"),
        t.string('agreement_id'),
        t.string('aadhar_card'),
        t.string('pan_card'),
        t.timestamp("time")
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("landlords")
};
