const db = {};
db.User = require('./user.model');
db.Admin = require('./admin.model');
for (const key in db) {
  db[key].Ndb = db
}
module.exports = db;