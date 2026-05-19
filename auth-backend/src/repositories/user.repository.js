import User from "../models/user.model.js";

export const findUserByEmail = (email) => {
  return User.findOne({ email });
};

export const createUser = (data) => {
  return User.create(data);
};

export const findUserById = (id) => {
  return User.findById(id);
};