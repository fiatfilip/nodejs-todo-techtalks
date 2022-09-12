const uuid = require('uuid');
const propertiesReader = require('properties-reader');
const properties = propertiesReader('dbConfig.properties');

const Pool = require('pg').Pool
const dbPool = new Pool({
  user: properties.get('user'),
  host: properties.get('host'),
  database: properties.get('database'),
  password: properties.get('password'),
  port: properties.get('port'),
})

dbPool.query(`CREATE TABLE IF NOT EXISTS todos(
				id uuid NOT NULL,
				name character varying(64) NOT NULL,
				open boolean NOT NULL DEFAULT true,
				CONSTRAINT todos_pkey PRIMARY KEY (id)
			)`, (error, results) => {
	if (error) {
	  throw error
	}
   return results.rows
})

const getTodos = async (state) => {
    const { rows } = await dbPool.query(`SELECT * FROM todos WHERE open = $1`, [state])

    return rows
  }

const addTodo = async (name) => {

	await dbPool.query('INSERT INTO todos (id, name, open) VALUES ($1, $2, $3)', [uuid.v4(), name, true])
}

const completeTodo = async (id) => {

	await dbPool.query('UPDATE todos SET open = false WHERE id = $1', [id])
}

module.exports = {
	getTodos,
	addTodo,
	completeTodo,
}