const { Sequelize } = require("sequelize");
const bodyParser = require("body-parser");
const UsersScheme = require("./models.js");
const express = require("express");
const argon2 = require("argon2");
const router = express();
const cors = require('cors');

router.use(cors())
router.use(express.json());

const authenticateDBConnection = async (sequelize) => {
  try {
    await sequelize.authenticate();
    return { result: "Connection has been established successfully." };
  } catch (error) {
    return { result: "Unable to connect to the database:", error };
  }
};

const syncDB = async (sequelize) => {
  try {
    sequelize.sync();
    return { result: "Connection has been established successfully." };
  } catch (err) {
    return { result: "Unable to connect to the database:", err };
  }
};

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: "database",
  dialect: "postgres",
});

const usersModel = sequelize.define("users", UsersScheme);

authenticateDBConnection(sequelize);
syncDB(sequelize);

router.post("/create-account", async (req, res) => {
  try {
    if (!req.body.password || !req.body.username)
      throw new Error("Password and username cannot be empty");

    const [user, created] = await usersModel.findOrCreate({
      where: { username: req.body.username },
      defaults: {
        username: req.body.username,
        passwordHash: await argon2.hash(req.body.password),
        gPoints: 0,
        flag: true,
      },
    });

    if (!created)
      throw new Error(`Username ${req.body.username} is already taken`);

    res.send("Account created successfully");
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.listen(process.env.BACKEND_PORT);
