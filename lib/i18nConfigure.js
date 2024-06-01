// cargar la librería
const i18n = require("i18n");
const path = require("node:path");

// configurar mi instancia de i18n
i18n.configure({
  locales: ["en", "es"],
  directory: path.join(__dirname, "..", "locales"),
  defaultLocale: "en",
  autoReload: true,
  syncFiles: true,
  cookie: "nodeapp-locale"
});

// para utilizar en scripts
// i18n.setLocale("en");

// exportamos la instancia de i18n
module.exports = i18n;
