import { pool } from "../config/dbconfig.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;

const generateAuthToken = (userId) => {
  const token = jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
  return token;
};

export const verifyAuthToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded.userId;
  } catch (error) {
    return null;
  };
};

const createTable = async (connection) => {
  const tableCreationQuery = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, user VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)";
  try {
    await connection.query(tableCreationQuery);
    connection.release();
    console.log("Table created");
  } catch (error) {
    if (process.env.PRODUCTION === "false") console.log(error);
    console.log("Table creation failed");
    return res.status(500).json("Server error");
  };
};

export const registerUser = async (req, res) => {
  const { user, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  let connection;
  try {
    connection = await pool.getConnection();
    const query = "INSERT INTO users (user, password) VALUES (?, ?)";
    await connection.query(query, [user, hash]);
    console.log("User created");
    res.status(201).json("User created");
  } catch (error) {
    if (process.env.PRODUCTION === "false") console.log(error);
    if (error.code === "ER_NO_SUCH_TABLE") {
      await createTable(connection);
      return await registerUser(req, res);
    } else if (error.code === "ER_DUP_ENTRY") {
      console.log("User already exists");
      return res.status(409).json("User already exists");
    } else {
      return res.status(500).json("Server error");
    };
  } finally {
    if (connection) connection.release();
  };
};

export const loginUser = async (req, res) => {
  const { user, password } = req.body;
  let connection;
  try {
    connection = await pool.getConnection();
    const query = "SELECT id, password FROM users WHERE user = ?";
    const result = await connection.query(query, [user]);

    if (result.length === 0) {
      return res.status(401).json("Invalid credentials");
    };

    const hashedPassword = result[0].password;
    const passwordMatch = await compare(password, hashedPassword);
    if (!passwordMatch) {
      return res.status(401).json("Invalid credentials");
    };

    const authToken = generateAuthToken(result[0].id);
    res.status(200).json({ authToken });
  } catch (error) {
    if (process.env.PRODUCTION === "false") console.log(error);
    res.status(500).json("Server error");
  } finally {
    if (connection) connection.release();
  };
};
