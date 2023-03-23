
const  db = require('../db')
exports.seed = async function() {
  
  // Deletes ALL existing entries
  await db('users').del()
  let res = await db.insert({ password: 'Admin',code : '123',name : "Yashwant",email:'yashwantsahu3002@gmail.com',role:'["Manager","Admin"]',supervisor:"Yashwant",mobile:"8239879127"}).into('users');
  // console.log(res)
};