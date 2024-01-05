const EventCalendarModel = require("../models/Eventos");

class EventCalendarRepository {
  async create(data) {
    try {
      return await new EventCalendarModel(data).save();
    } catch (err) {
      throw err;
    }
  }

  async getAll() {
    try {
      return await EventCalendarModel.find({});
    } catch (err) {
      throw err;
    }
  }

  async getOne(_id) {
    try {
      return await EventCalendarModel.findOne({_id});
    } catch (err) {
      throw err;
    }
  }

  async delete(_id) {
    try {
      return await EventCalendarModel.findOneAndDelete({_id});
    } catch (err) {
      throw err;
    }
  }

  async update(data) {
    try {
      return await EventCalendarModel.findOneAndUpdate({_id: data._id}, {$set: data}, {new: true});
    } catch (err) {
      throw err;
    }
  }
}

module.exports = EventCalendarRepository;