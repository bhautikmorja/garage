const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["mechanic", "admin", "customer"],
    default: "customer",
  },
});

const mechanicSchema = new schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "mechanic",
  },
});

const adminSchema = new schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "admin",
  },
});

const User = mongoose.model("User", userSchema);
const Mechanic = mongoose.model("Mechanic", mechanicSchema);
const Admin = mongoose.model("Admin", adminSchema);

module.exports = { User, Mechanic, Admin };