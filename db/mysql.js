const knex = require("knex")({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        database: "desafioChat"
    }
})

knex.schema.createTableIfNotExists('productos', (table) => {
    table.increments("id").primary();
    table.string('title');
    table.float('price');
    table.string('thumbnail').defaultTo("https://justmockup.com/wp-content/uploads/edd/2019/08/box-packaging-mockup-free-download.jpg");
}).then(res => {
    console.log("Tabla creada exitosamente")
}).catch(err => {
    console.log(err)
})


///CREACION DE LOTE DE PRUEBAS - DESCOMENTAR PARA EJECUTAR 1 SOLA VEZ

// knex('productos').insert(
//     [
//         {
//             title: "PRODUCTO A",
//             price: "123.45",
//             thumbnail: "http://openclipart.org/image/800px/svg_to_png/87397/Cyrillic_A.png"
//         },
//         {
//             title: "PRODUCTO B",
//             price: "200",
//             thumbnail: "https://w7.pngwing.com/pngs/204/874/png-transparent-letter-case-b-letter-b-miscellaneous-text-rectangle-thumbnail.png"
//         },
//         {
//             title: "PRODUCTO C",
//             price: "250",
//             thumbnail: "https://media.istockphoto.com/vectors/vector-colorful-gem-stones-font-letter-c-vector-id991983766"
//         },
//         {
//             title: "PRODUCTO D",
//             price: "1000",
//             thumbnail: "https://us.123rf.com/450wm/inkdrop/inkdrop1910/inkdrop191006642/132480573-letra-d-distorsionada-fuente-de-texto-con-efecto-de-falla-de-ne%C3%B3n-render-3d.jpg?ver=6"
//         },
//         {
//             title: "PRODUCTO E",
//             price: "1500",
//             thumbnail: "https://justmockup.com/wp-content/uploads/edd/2019/08/box-packaging-mockup-free-download.jpg"
//         },
//         {
//             title: "PRODUCTO X",
//             price: "450"
//         }
//     ]
// ).then(res => {
//     console.log("Productos creados exitosamente");
// }).catch(err => {
//     console.log(err)
// })


module.exports = knex;