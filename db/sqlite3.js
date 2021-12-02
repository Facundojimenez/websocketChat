const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./mydb.sqlite"
    }
});


knex.schema.createTableIfNotExists('mensajes', (table) => {
    table.increments("id").primary();
    table.string('email_usuario');
    table.string('mensaje');
    table.timestamps('fecha');
}).then(res => {
    console.log("Tabla creada exitosamente")
}).catch(err => {
    console.log(err)
})


  module.exports = knex;