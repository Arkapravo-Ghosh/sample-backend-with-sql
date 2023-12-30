import mariadb from "mariadb";

const poolConfig = {
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWD,
  database: process.env.MARIADB_DB,
  connectionLimit: 5,
};

const pool = mariadb.createPool(poolConfig);

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MariaDB!");
    connection.release();
  } catch (error) {
    console.log("Error connecting to MariaDB:", error.message);
    if (process.env.PRODUCTION === "false") {
      console.log(poolConfig);
    };
  };
};

export { pool };
export default connectDB;
