# 🛒 Nodepop

> 👤 Marta Vilaseca Foradada  
> 💻 XVI Bootcamp Full Stack Web  
> 📅 2 Junio 2024

Desarrollar el API que se ejecutará en el servidor de un servicio de venta de artículos de segunda mano llamado **Nodepop**.

---

- [Instalación e inicialización](#instalación-e-inicialización)
- [Guía de uso: Website](#website)
- [Guía de uso: API](#api)
  - [⭐ Autenticación con JSON Web Token](#large_orange_diamond-autenticación)
  - [Para obtener anuncios usando GET](#large_orange_diamond-para-obtener-anuncios-usando-el-método-get)
  - [⭐ Para añadir un anuncio nuevo usando POST](#large_orange_diamond-para-añadir-un-anuncio-nuevo-usando-el-método-post)
  - [Para modificar un anuncio existente usando PATCH](#large_orange_diamond-para-modificar-un-anuncio-existente-usando-el-método-patch)
  - [Para eliminar un anuncio existente usando DELETE](#large_orange_diamond-para-eliminar-un-anuncio-existente-usando-el-método-delete)
- [Anexo: listado de tags válidos](#tags-válidos)
- [Anexo: formatos de imagen permitidos](#formatos-de-imagen-válidos)
- [Anexo: requisitos práctica según enunciado](#requisitos-v1)
- [⭐ Anexo: novedades V2](#requisitos-v2)

![Screenshot](/public/images/nodepop-screenshot.jpg)

---

# 📄 Documentación App

## Instalación e inicialización

⏬ **Clonamos el repositorio** en nuestro sistema

```sh
git clone git@github.com:marta-vilaseca/keepcoding-intro-node-pra.git
```

:open_file_folder: Cambiamos al directorio del repositorio e **instalamos las dependencias** necesarias:

```sh
cd keepcoding-intro-node-pra
npm install
```

✅ Nos aseguramos que tenemos el **servidor de MongoDB** instalado y ejecutándose en nuestro sistema  
✅ Cargamos los **anuncios por defecto** con que vienen incluídos en el archivo `initDB.js` que se proporciona en la carpeta del proyecto.

> [!CAUTION]  
> Ejecutar y confirmar este comando provocará el borrado de todo el contenido actual de la base de datos

> [!NOTE]  
> El comando solo se ejecutará con éxito si respondemos 'si' a la pregunta que se nos formula

```sh
node initDB.js
```

:arrow_forward: Una vez tenemos nuestra base de datos lista, ya podemos **inicializar nuestra aplicación**

💻 **`npm run dev`** para inicializar en **modo desarrollo**, en el cual:

- _nodemon_ irá monitorizando los cambios que se produzcan en la app y reiniciando el servidor automáticamente según sea necesario
- podremos ver información de los **errores** que se puedan ir produciendo, tanto en la API como en el website

🌍 **`npm start`** para inicializar en **modo producción**

---

## Guía de uso

A partir de aquí podremos :

- acceder al **website de NodePop** con nuestro navegador a través de la URL **`http://localhost:3000/`** e interactuar con él mediante distintos filtros (detallados en la sección [website](#website))
- **interactuar con el API** directamente mediante API requests (detalladas en la sección [API](#api)), usando el propio navegador o (en el caso de los endpoints utilizando los métodos POST, PATCH o DELETE) herramientas como [Postman](https://www.postman.com/).

---

### Website

:small_blue_diamond: Para ver el **listado de anuncios completo** visitaremos en nuestro navegador la ruta base del website:

```
http://localhost:3000/
```

:small_blue_diamond: Para **ver un anuncio específico** usaremos la ruta base seguida de la ID del mismo:

```
http://localhost:3000/:id
```

➜ Ejemplo: `http://localhost:3000/65e07cd8a31092a089d1f0fd`

> [!NOTE]  
> Las ID de los anuncios podemos obtenerlas (para poder introducirlas manualmente en nuestra URL) si interactuamos con la API y recibimos los datos de los anuncios en formato JSON. Sin embargo para facilitar las cosas, en el website para acceder a cada anuncio individual bastará con **clicar sobre su título o su foto**.

:small_blue_diamond: Para ver el **listado de los distintos tags** que hay en la base de datos usaremos:

```
http://localhost:3000/tags/
```

#### Parámetros para filtrar

:small_blue_diamond: Para obtener **un listado de anuncios filtrados por título**, de manera que el nombre o título del anuncio empiece por la `:cadena` de caracteres especificada:

```
http://localhost:3000/?nombre=:cadena
```

➜ Ejemplo: `http://localhost:3000/?nombre=vi` mostrará todos los anuncios cuyo título empiece por `vi`

:small_blue_diamond: Para obtener listado de anuncios **bajo un tag determinado**:

```
http://localhost:3000/?tags=:tag
```

➜ Ejemplo: `http://localhost:3000/?tags=mobile` mostrará todos los anuncios bajo el tag `mobile`

:small_blue_diamond: Para obtener listado de anuncios **en función de su status de venta**:

➜ Ejemplo: `http://localhost:3000/?tipo=venta` muestra los anuncios de productos en venta  
➜ Ejemplo: `http://localhost:3000/?tipo=busqueda` muestra los anuncios de productos que alguien esté buscando

:small_blue_diamond: Para obtener **listado de anuncios filtrado por (rango de) precio**:

- Productos cuyo precio sea `n` o más: `/?precio=:n-`  
  ➜ Ejemplo: `http://localhost:3000/?precio=50-`
- Productos cuyo precio sea menor a `n`: `/?precio=-:n`  
  ➜ Ejemplo: `http://localhost:3000/?precio=-100`
- Productos cuyo precio esté entre `n` y `n1` `/?precio=:n-:n1`  
  ➜ Ejemplo: `http://localhost:3000/?precio=50-100`
- Productos cuyo precio sea _exactamente_ `n` `/?precio=:n`  
  ➜ Ejemplo: `http://localhost:3000/?precio=150`

:small_blue_diamond: Para aplicar **paginación** podemos utilizar:

- `skip` para saltar hasta un elemento determinado  
  ➜ Ejemplo: `http://localhost:3000/?skip=2` empezará la lista desde el elemento número 3
- `limit` para determinar cuantos elementos queremos ver de una vez (por página)  
  ➜ Ejemplo: `http://localhost:3000/?limit=5` nos mostrará solo 5 elementos de una vez (por página)

:small_blue_diamond: Para **ordenar** los resultados de acuerdo a un campo determinado. Podemos incluir **más de un campo** separándolos por espacios, o añadir un **'-'** como modificador para indicar orden descendiente.

➜ Ejemplo: `http://localhost:3000/?sort=-precio` ordenamos por precio DESC  
➜ Ejemplo: `http://localhost:3000/?sort=-precio%20nombre` ordenamos por precio DESC y luego nombre ASC

#### :small_blue_diamond: **Ejemplo encadenando varios parámetros:**

```
http://localhost:3000/?tags=lifestyle&limit=12&precio=100-&sort=-precio%20nombre
```

---

### API

#### :large_orange_diamond: Autenticación

⭐ **Novedad v2 ➡** Los endpoints de la API están ahora protegidos, así que es necesario **identificarse como usuario registrado** para **obtener un JSON Web Token** antes de **realizar cualquier acción**.

Desde Postman o equivalente, crearemos una **POST request** apuntando a `http://localhost:3000/api/authenticate`

A través del apartado **Body > x-www-form-urlencoded** enviaremos la información para autenticarnos con nuestra info de usuario, por ejemplo si utilizamos el usuario por defecto:

| Key            | Value            |
| -------------- | ---------------- |
| **email**      | user@example.com |
| **password**   | 1234             |

La respuesta a esta request nos proporcionará un token en el siguiente formato:
```json
{
    "tokenJWT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjVjNGEyYWUwZWE2NDgzNmM0M2IwMjQiLCJpYXQiOjE3MTczMzA2OTQsImV4cCI6MTcxNzMzNzg5NH0.ozPhk_OdYQi3JVkinHreHTGVqE4dv3zQhH8RcIEwLxM"
}
```
Dicho token **será válido durante dos horas** _(pasado ese tiempo será necesario repetir este proceso para obtener otro)_. **Deberemos utilizarlo siempre que necesitemos hacer cualquiera de las peticiones a la API que se detallan en los siguientes apartados**. 

Podremos incluir el token al hacer nuestras peticiones de cualquiera de estas tres maneras:

##### En el header
![Screenshot](/public/images/token-header.jpg)

##### En el body
![Screenshot](/public/images/token-body.jpg)

##### Como parámetro en el query
![Screenshot](/public/images/token-params.jpg)


#### :large_orange_diamond: Para obtener anuncios (usando el método GET)

> [!NOTE]  
> Desde la v2, cualquier acción usando este endpoint necesita autenticación

A través del **endpoint** `/api/anuncios` _(ruta completa `http://localhost:3000/api/anuncios`)_ podemos obtener:

- Un **listado general** de todos los anuncios
- Un listado **filtrado de acuerdo a distintos criterios** (nombre, status de venta, precio, tags) y que opcionalmente además podremos:
  - paginar
  - ordenar por uno o más de los campos existentes, en orden ascendente o descendente

:small_orange_diamond: Para obtener el **listado de anuncios completo**:

```
/api/anuncios/
```

:small_orange_diamond: Para obtener **un anuncio específico** usaremos la ruta base seguida de la ID del mismo:

```
/api/anuncios/:id
```

➜ Ejemplo: `http://localhost:3000/api/anuncios/65e07cd8a31092a089d1f0fd`

:small_orange_diamond: Para ver el **listado de los distintos tags** que hay en la base de datos usaremos:

```
/api/tags/
```

#### Parámetros para filtrar

:small_orange_diamond: Para obtener **un listado de anuncios filtrados por título**, de manera que el nombre o título del anuncio empiece por la `:cadena` de caracteres especificada:

```
/api/anuncios?nombre=:cadena
```

➜ Ejemplo: `http://localhost:3000/api/anuncios?nombre=vi` mostrará todos los anuncios cuyo título empiece por `vi`

:small_orange_diamond: Para obtener listado de anuncios **de un tag determinado**:

```
/api/anuncios?tags=:tag
```

➜ Ejemplo: `http://localhost:3000/api/anuncios?tags=mobile` mostrará todos los anuncios bajo el tag `mobile`

:small_orange_diamond: Para obtener listado de anuncios **en función de su status de venta**:

➜ Ejemplo: `http://localhost:3000/api/anuncios?tipo=venta` muestra los anuncios de productos en venta  
➜ Ejemplo: `http://localhost:3000/api/anuncios?tipo=busqueda` muestra los anuncios de productos que alguien esté buscando

:small_orange_diamond: Para obtener **listado de anuncios filtrado por (rango de) precio**:

- Productos cuyo precio sea `n` o más: `/api/anuncios?precio=:n-`  
  ➜ Ejemplo: `http://localhost:3000/api/anuncios?precio=50-`
- Productos cuyo precio sea menor a `n`: `/api/anuncios?precio=-:n`  
  ➜ Ejemplo: `http://localhost:3000/api/anuncios?precio=-100`
- Productos cuyo precio esté entre `n` y `n1` `/api/anuncios?precio=:n-:n1`  
  ➜ Ejemplo: `http://localhost:3000/api/anuncios?precio=50-100`
- Productos cuyo precio sea _exactamente_ `n` `/api/anuncios?precio=:n`  
  ➜ Ejemplo: `http://localhost:3000/api/anuncios?precio=150`

:small_orange_diamond: Para aplicar **paginación** podemos utilizar:

- `skip` para saltar hasta un elemento determinado  
  ➜ Ejemplo: `http://localhost:3000/api/anuncios?skip=2` empezará la lista desde el elemento número 3
- `limit` para determinar cuantos elementos queremos ver de una vez (por página)  
  ➜ Ejemplo: `http://localhost:3000/api/anuncios?limit=5` nos mostrará solo 5 elementos de una vez (por página)

:small_orange_diamond: Para **ordenar** los resultados de acuerdo a un campo determinado. Podemos incluir **más de un campo** separándolos por espacios, o añadir un \*'-'\_ como modificador para indicar orden descendiente.

➜ Ejemplo: `http://localhost:3000/api/anuncios?sort=-precio` ordenamos por precio DESC  
➜ Ejemplo: `http://localhost:3000/api/anuncios?sort=-precio%20nombre` ordenamos por precio DESC y luego nombre ASC

#### :small_orange_diamond: **Ejemplo encadenando varios parámetros:**

```
http://localhost:3000/api/anuncios?tags=lifestyle&limit=12&precio=100-&sort=-precio%20nombre
```

#### :large_orange_diamond: Para añadir un anuncio nuevo (usando el método POST)

> [!NOTE]  
> Desde la v2, cualquier acción usando este endpoint necesita autenticación

Desde Postman o equivalente, crearemos una **POST request** apuntando a `http://localhost:3000/api/anuncios`

A través del apartado **Body > form-data** _(ya que estamos enviando una imagen es necesario usar form-data)_ podemos añadir un nuevo anuncio con los siguientes pares de key/value:

| Key             | Value      | Requerido |                                                                                                                                                                                                     |
| --------------- | ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **nombre**      | [Text] [String]   | ✔         |                                                                                                                                                                                                     |
| **tipo**        | [Text] [Booleano]  | ✔         | `true` para anuncio de venta, `false` para anuncio de búsqueda                                                                                                                                      |
| **precio**      | [Text] [Numérico] | ✔         |                                                                                                                                                                                                     |
| **tags**        | [Text] [String]  | ✔         | repetiremos el par key: `tags` / value: `cadena` para cada tag que queramos añadir. Tener en cuenta que **solo aceptará los [tags válidos](#tags-válidos)**                                         |
| **descripcion** | [Text] [String]  |           | opcional y solo visible en la vista de anuncio individual, podemos añadir un texto para el anuncio. Si no ponemos nada nos rellenará el espacio con un texto _lorem ipsum_ especificado por defecto |
| **descripcion** | [File]   |           | opcional. Si lo dejamos vacío nos guardará el anuncio con el _placeholder_ por defecto `no-photo.png`. **Formatos válidos: `jpg`, `png`, `gif` o `webp`**|


Tras mandarlo y si todo valida correctamente, recibiremos una respuesta en este formato:

```json
{
  "result": {
    "nombre": "Rice cooker",
    "tipo": false,
    "precio": 110,
    "foto": "1717339819450-rice-cooker.png",
    "tags": ["home", "lifestyle"],
    "descripcion": "Prueba de descripción de producto. Puede ser tan larga como necesitemos.",
    "_id": "65e3c5a2b330409bef4afbdf",
    "__v": 0
  }
}
```

#### :large_orange_diamond: Para modificar un anuncio existente (usando el método PATCH)

> [!NOTE]  
> Desde la v2, cualquier acción usando este endpoint necesita autenticación

Desde Postman o equivalente, crearemos una **PATCH request** apuntando a `http://localhost:3000/api/anuncios/:id`, donde reemplazaremos id por el identificador del anuncio que queremos modificar

A través del apartado **Body > form-data** podemos modificar el anuncio de forma similar a como haríamos para crear uno nuevo, **pero solo incluyendo los campos cuyo contenido vamos a cambiar.**

Por ejemplo en caso de querer modificar el **precio** de un anuncio:

| Key        | Value                                 |
| ---------- | ------------------------------------- |
| **precio** | Nuevo precio, en formato _[Numérico]_ |

Al enviar y si todo valida correctamente, recibiremos una respuesta en este formato (con el anuncio entero actualizado, en este caso con nuevo precio de `200`):

```json
{
  "result": {
    "nombre": "Rice cooker",
    "tipo": false,
    "precio": 200,
    "foto": "1717339819450-rice-cooker.png",
    "tags": ["home", "lifestyle"],
    "descripcion": "Prueba de descripción de producto. Puede ser tan larga como necesitemos.",
    "_id": "65e3c5a2b330409bef4afbdf",
    "__v": 0,
    "thumbnail": "thumb-1717339819450-rice-cooker.png" 
  }
}
```

#### :large_orange_diamond: Para eliminar un anuncio existente (usando el método DELETE)

> [!NOTE]  
> Desde la v2, cualquier acción usando este endpoint necesita autenticación

Desde Postman o equivalente, crearemos una **DELETE request** apuntando a `http://localhost:3000/api/anuncios/:id`, donde reemplazaremos id por el identificador del anuncio que queremos eliminar.

No tenemos que introducir más parámetros. **Junto con el anuncio, se borrarán su imagen y thumbnail asociados.**

> [!CAUTION]  
> No nos pedirá confirmación de ningún tipo, al enviar la petición y si la id proporcionada es correcta **se borrará el anuncio automáticamente**

Si no ha habido ningún error, recibiremos esta respuesta:

```json
{
  "message": "Document successfully deleted."
}
```

---

## Anexo

### Tags válidos

- collectibles
- electronics
- fashion
- games
- home
- lifestyle
- mobile
- motor
- outdoors
- work

### Formatos de imagen válidos

- `.jpg`, `.jpeg`
- `png`
- `gif`
- `webp`

### Requisitos v1

Según especificado en el enunciado o _briefing_, el servicio mantiene anuncios de compra o venta de artículos y permite tanto buscar como poner filtros por varios criterios, por tanto la API a desarrollar deberá proveer los métodos necesarios para esto.

Los sistemas donde se utilizará la API utilizan **bases de datos MongoDB**

Además del desarrollo de la API, es necesario que el site tenga una página frontend que muestre la lista de anuncios con los filtros que correspondan, según la URL introducida.

#### 📃 Datos de cada anuncio:

- **Nombre** del artículo/anuncio
- Si el artículo está en **Venta** o bien el anuncio es porque alguien está buscando ese producto
- **Precio** del artículo (de venta o de cuánto está dispuesto a pagar el anunciante, en caso de estarlo buscando)
- **Foto** del artículo (una sola por anuncio)
- **Tags**, conteniendo siempre uno o varios de [los tags válidos](#tags-válidos)

#### ✅ Operaciones que debe realizar el API:

- [x] Lista de anuncios
  - [x] Posibilidad de paginación
  - [x] Filtros por tag
  - [x] Filtros por tipo de anuncio (venta/búsqueda)
  - [x] Filtros por rango de precio (especificando precio min y max)
  - [x] Filtro por nombre de artículo (que empiece por el texto buscado)
- [x] Lista de los tags existentes
- [x] Creación de anuncio

#### ➕ Extras valorados positivamente:

- [x] Documentación
- [x] Validar nuestro código con ESLint

### Requisitos v2

#### 🔒 Autenticación con JWT

- [x] Implementar autenticación JWT al API (no es necesario hacerlo en el website)
  - [x] **POST** `/api/authenticate` para hacer login y devolver un token JWT
  - [x] **GET** `/api/anuncios` incluyendo el JWT en una cabecera o query-string hará la petición correcta (200 OK)
  - [x] **GET** `/api/anuncios` sin token responderá con un código de status HTTP 401 y un json con info del error
  - [x] **GET** `/api/anuncios` con un token caducado responderá con un código de status HTTP 401 y un json con info del error
- [x] Incluir para el API (al menos) un usuario con email **user@example.com** y clave **1234**

#### 🌍 Internacionalización

- [x] Convertir el frontend de Nodepop en multi-idioma (No es necesario internacionalizar el API)
- [x] Con selector de idioma donde el usuario pueda cambiar de un idioma a otro
- [x] Dos idiomas disponibles:
  - [x] Español
  - [x] Inglés

#### 📷 Subida de imagen con tarea en background

- [x] El API necesita un endpoint para crear anuncios
  - [x] `POST /api/anuncios`
  - [x] Permite que el cliente del API suba una imagen y esta se guarde en el servidor
    - [x] Cuando hagamos las peticiones `GET /api/anuncios` nos son devueltas las rutas a éstas imágenes y éstas funcionan
  - [x] Cada imagen que se suba debe tener un thumbnail. Podemos hacer un microservicio que reciba trabajos (**Cote**, ~~RabbitMQ~~) creando dichos thumbnails:
    - [x] Elegir, instalar y probar un paquete que nos permita cambiar imágenes de tamaño en Node (**Jimp**)
    - [x] Hacer que el API mande un mensaje (con **Cote** ~~o con una cola de RabbitMQ~~) con la ruta del filesystem a la imagen
    - [x] Crear un worker que esté suscrito
- [x] Como extra, se ha instalado la librería **Concurrently** para poder arrancar el microservicio conjuntamente con `npm run dev` o `npm start`, sin necesidad de arrancarlos por separado manualmente en otra terminal

#### ✅ OPCIONAL: Tests con supertest

- [ ] Como extra, aunque finalmente no implementado, también se pedía la creación de tests para la aplicación con **Supertest**