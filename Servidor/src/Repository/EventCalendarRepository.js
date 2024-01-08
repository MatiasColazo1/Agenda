const EventCalendarModel = require("../models/Eventos");

class EventCalendarRepository {
  async create(data) {
    try {
      const event = new EventCalendarModel(data);
      return await event.save();
    } catch (err) {
      throw err;
    }
  }

  async getAll(userUd) {
    try {
      return await EventCalendarModel.find({ user: userUd });
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