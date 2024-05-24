const mysql = {
  type: 'mysql',
  host: process.env.DB_HOSTNAME || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'ems_db',
}

const sqlite = {
  type: 'sqlite',
  database: (process.env.DB_DATABASE && `${process.env.DB_DATABASE}.sqlite`) || 'ems_db.sqlite',
}

const databases = {
  mysql,
  sqlite
}

export default {
  ...(databases[process.env.DB_TYPE || 'sqlite'])
}