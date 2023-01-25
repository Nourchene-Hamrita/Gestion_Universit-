let db = {};

db.AccessRights = require('./AccessRights.model');
db.Admin = require('./admin.model');
db.Administrative = require('./Administrative.model');
db.Alumni = require('./Alumni.model');
db.Contract = require('./Contract.model');
db.Event = require('./Event.model');
db.EventInvitation = require('./EventInvitation.model');
db.Experience = require('./Experience.model');
db.Offer = require('./Offer.model');
db.PFA = require('./PFA.model');
db.PFE = require('./PFE.model');
db.Student = require('./Student.model');
db.Teacher = require('./Teacher.model');
db.TrainingManager = require('./TrainingManager.model');
db.UniversitySeason = require('./UniversitySeason.model');
db.User = require('./user.model');
db.VacationRequest = require('./VacationRequest.model');


for (const key in db) {
  if (!db[key].crudOptions)
    db[key].crudOptions = {}
  db[key].Ndb = db
}
module.exports = db;