"use strict";

const fs = require("node:fs");
const readline = require("node:readline");
const connection = require("./lib/connectMongoose");

const { Anuncio, Usuario } = require("./models");

// Leemos los anuncios a insertar desde un archivo JSON externo
const data = JSON.parse(fs.readFileSync("./anuncios.json", "utf-8"));

main().catch((err) => console.log("Se ha producido un error!", err));

async function main() {
  await new Promise((resolve) => {
    connection.once("open", resolve);
  });
  const borrar = await pregunta("Estas seguro de querer borrar el contenido de la base de datos? (no) ");

  // si el usuario no responde afirmativamente, parar la ejecución
  if (!borrar) {
    process.exit();
  }

  // si no, seguir adelante con el borrado e inserción de anuncios en la BD
  await initUsers();
  await initAds();

  connection.close();
}

async function initAds() {
  // borrar todos los anuncios
  const deleted = await Anuncio.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} anuncios.`);

  // asignamos propietario a los anuncios basados en el campo ownerEmail
  const adsWithOwners = await Promise.all(
    data.map(async (ad) => {
      if (!ad.ownerEmail) {
        throw new Error(`El siguiente anuncio no tiene owner asociado: ${JSON.stringify(ad)}`);
      }

      const user = await Usuario.findOne({ email: ad.ownerEmail });
      if (!user) {
        throw new Error(`No se ha encontrado al usuario: ${ad.ownerEmail}`);
      }
      return { ...ad, owner: user._id };
    })
  );

  // crear los anuncios iniciales
  const inserted = await Anuncio.create(adsWithOwners);
  console.log(`Creados ${inserted.length} anuncios.`);
}

async function initUsers() {
  // borrar todos los usuarios
  const deleted = await Usuario.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} usuarios.`);

  // crear usuarios iniciales
  const inserted = await Usuario.insertMany([
    { email: "user@example.com", password: await Usuario.hashPassword("1234") },
    { email: "admin@example.com", password: await Usuario.hashPassword("1357924680") },
  ]);
  console.log(`Creados ${inserted.length} usuarios.`);
}

function pregunta(texto) {
  return new Promise((resolve) => {
    // conectar readline con la consola
    const ifc = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    // recoger respuesta del usuario
    ifc.question(texto, (respuesta) => {
      ifc.close();
      resolve(respuesta.toLowerCase() === "si");
    });
  });
}
