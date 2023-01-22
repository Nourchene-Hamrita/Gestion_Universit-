const db = {};
db.User = require('./user.model');
db.Admin = require('./admin.model');
db.Student = require('./Student.model');
db.Alumni = require('./Alumni.model');
db.Teacher = require('./Teacher.model');
db.TrainingManager = require('./TrainingManager.model');
db.Administrative = require('./Administrative.model');
db.PFA = require('./PFA.model');
db.PFE = require('./PFE.model');
db.Experience = require('./Experience.model');
db.Event = require('./Event.model');
db.EventInvitation = require('./EventInvitation.model');
db.Contract = require('./Contract.model');
db.VacationRequest = require('./VacationRequest.model');
db.AccessRights = require('./AccessRights.model');
db.UniversitySeason = require('./UniversitySeason.model');


for (const key in db) {
  if (!db[key].crudOptions)
    db[key].crudOptions = {}
  db[key].Ndb = db
}
module.exports = db;