//This is used to load file from _data folder and insert and delete from database
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

//Load env variables
dotenv.config({
  path: "./config/config.env",
});

//Load models
const User = require("./model/user");
const Items = require("./model/items");

//Connect to DB
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, "utf-8")
);
const items = JSON.parse(
  fs.readFileSync(`${__dirname}/data/items.json`, "utf-8")
);

// Import into DB
const importsData = async () => {
  try {
    await User.create(users);
    await Items.create(items);

    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

//Delete Data
const deleteData = async () => {
  try {
    await Items.deleteMany();
    await User.deleteMany();
    console.log("Data Deleted...".red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  importsData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

// To insert :
//node seeder -i

//to delete
//node seeder -d
