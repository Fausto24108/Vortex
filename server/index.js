const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()
const PORT = 3001

const client =
  new MongoClient(
    process.env.MONGODB_URI
  )

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)

app.use(
  express.json()
)

let users
let planets
let customPlanets

function crearToken(usuario) {
  return jwt.sign(
    {
      id: usuario._id.toString(),
      email: usuario.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )
}

function obtenerToken(req) {
  const authorization =
    req.headers.authorization

  if (
    !authorization ||
    !authorization.startsWith(
      'Bearer '
    )
  ) {
    return null
  }

  return authorization.split(' ')[1]
}

async function autenticar(
  req,
  res,
  next
) {
  try {
    const token =
      obtenerToken(req)

    if (!token) {
      return res
        .status(401)
        .json({
          mensaje:
            'No hay sesión iniciada'
        })
    }

    const datos =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      )

    const usuario =
      await users.findOne({
        _id:
          new ObjectId(datos.id)
      })

    if (!usuario) {
      return res
        .status(401)
        .json({
          mensaje:
            'Usuario no encontrado'
        })
    }

    req.usuario = usuario

    next()
  } catch {
    res
      .status(401)
      .json({
        mensaje:
          'Sesión inválida o expirada'
      })
  }
}

app.get(
  '/api/planetas/:slug',
  async (req, res) => {
    try {
      const slug =
        req.params.slug
          .trim()
          .toLowerCase()

      const planeta =
        await planets.findOne({
          slug
        })

      if (!planeta) {
        return res
          .status(404)
          .json({
            mensaje:
              'Planeta no encontrado'
          })
      }

      res.json({
        planeta
      })
    } catch (error) {
      console.error(error)

      res
        .status(500)
        .json({
          mensaje:
            'Error interno del servidor'
        })
    }
  }
)

app.post(
  '/api/custom-planets',
  autenticar,
  async (req, res) => {
    try {
      const {
        nombre,
        descripcion,
        tipo,
        color,
        tamano,
        gravedad,
        diametro
      } = req.body

      if (
        !nombre ||
        !descripcion ||
        !tipo ||
        !color ||
        !tamano ||
        gravedad === undefined ||
        diametro === undefined
      ) {
        return res
          .status(400)
          .json({
            mensaje:
              'Todos los campos del planeta son obligatorios'
          })
      }

      const tiposPermitidos = [
        'rocoso',
        'gaseoso',
        'gigante-helado'
      ]

      const coloresPermitidos = [
        'rojo',
        'naranja',
        'amarillo',
        'verde',
        'azul',
        'celeste',
        'violeta',
        'gris'
      ]

      const tamañosPermitidos = [
        'pequeño',
        'mediano',
        'grande',
        'gigante'
      ]

      const gravedadesPermitidas = [
        1.6,
        3.2,
        6.4,
        9.8,
        18.5
      ]

      const diametrosPermitidos = [
        5000,
        10000,
        20000,
        60000
      ]

      if (
        !tiposPermitidos.includes(
          tipo
        )
      ) {
        return res
          .status(400)
          .json({
            mensaje:
              'Tipo de planeta inválido'
          })
      }

      if (
        !coloresPermitidos.includes(
          color
        )
      ) {
        return res
          .status(400)
          .json({
            mensaje:
              'Color de planeta inválido'
          })
      }

      if (
        !tamañosPermitidos.includes(
          tamano
        )
      ) {
        return res
          .status(400)
          .json({
            mensaje:
              'Tamaño de planeta inválido'
          })
      }

      if (
        !gravedadesPermitidas.includes(
          Number(gravedad)
        )
      ) {
        return res
          .status(400)
          .json({
            mensaje:
              'Gravedad inválida'
          })
      }

      if (
        !diametrosPermitidos.includes(
          Number(diametro)
        )
      ) {
        return res
          .status(400)
          .json({
            mensaje:
              'Diámetro inválido'
          })
      }

      const nuevoPlaneta = {
        user_id:
          req.usuario._id,

        creador: {
          id:
            req.usuario._id.toString(),

          nombre:
            req.usuario.nombre
        },

        nombre:
          nombre.trim(),

        descripcion:
          descripcion.trim(),

        tipo,

        color,

        tamano,

        gravedad:
          Number(gravedad),

        diametro:
          Number(diametro),

        publico:
          true,

        fechaCreacion:
          new Date()
      }

      const resultado =
        await customPlanets.insertOne(
          nuevoPlaneta
        )

      const planetaCreado = {
        _id:
          resultado.insertedId,

        ...nuevoPlaneta
      }

      res
        .status(201)
        .json({
          mensaje:
            'Planeta creado correctamente',

          planeta:
            planetaCreado
        })
    } catch (error) {
      console.error(error)

      res
        .status(500)
        .json({
          mensaje:
            'Error interno del servidor'
        })
    }
  }
)

app.get(
  '/api/custom-planets/public',
  async (req, res) => {
    try {
      const planetas =
        await customPlanets
          .find({
            publico: true
          })
          .sort({
            fechaCreacion: -1
          })
          .toArray()

      res.json({
        planetas
      })
    } catch (error) {
      console.error(error)

      res
        .status(500)
        .json({
          mensaje:
            'No se pudieron cargar los planetas públicos'
        })
    }
  }
)

app.get(
  '/api/custom-planets/mine',
  autenticar,
  async (req, res) => {
    try {
      const planetas =
        await customPlanets
          .find({
            user_id:
              req.usuario._id
          })
          .sort({
            fechaCreacion: -1
          })
          .toArray()

      res.json({
        planetas
      })
    } catch (error) {
      console.error(error)

      res
        .status(500)
        .json({
          mensaje:
            'No se pudieron cargar tus planetas'
        })
    }
  }
)

app.get(
  '/api/custom-planets/:id',
  autenticar,
  async (req, res) => {
    try {
      const id =
        req.params.id

      if (
        !ObjectId.isValid(id)
      ) {
        return res
          .status(400)
          .json({
            mensaje:
              'ID de planeta inválido'
          })
      }

      const planeta =
        await customPlanets.findOne({
          _id:
            new ObjectId(id)
        })

      if (!planeta) {
        return res
          .status(404)
          .json({
            mensaje:
              'Planeta no encontrado'
          })
      }

      const esPropietario =
        planeta.user_id &&
        planeta.user_id.toString() ===
          req.usuario._id.toString()

      if (
        !planeta.publico &&
        !esPropietario
      ) {
        return res
          .status(403)
          .json({
            mensaje:
              'No tenés permiso para ver este planeta'
          })
      }

      res.json({
        planeta
      })
    } catch (error) {
      console.error(error)

      res
        .status(500)
        .json({
          mensaje:
            'No se pudo cargar el planeta'
        })
    }
  }
)

app.post(
  '/api/auth/register',
  async (req, res) => {
    try {
      const {
        nombre,
        email,
        password
      } = req.body

      if (
        !nombre ||
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            mensaje:
              'Todos los campos son obligatorios'
          })
      }

      if (
        password.length < 6
      ) {
        return res
          .status(400)
          .json({
            mensaje:
              'La contraseña debe tener al menos 6 caracteres'
          })
      }

      const emailNormalizado =
        email
          .trim()
          .toLowerCase()

      const usuarioExistente =
        await users.findOne({
          email:
            emailNormalizado
        })

      if (usuarioExistente) {
        return res
          .status(409)
          .json({
            mensaje:
              'Ya existe una cuenta con ese correo'
          })
      }

      const passwordHash =
        await bcrypt.hash(
          password,
          10
        )

      const nuevoUsuario = {
        nombre:
          nombre.trim(),

        email:
          emailNormalizado,

        password:
          passwordHash,

        foto:
          null,

        biografia:
          '',

        fechaRegistro:
          new Date()
      }

      const resultado =
        await users.insertOne(
          nuevoUsuario
        )

      const usuarioCreado = {
        _id:
          resultado.insertedId,

        ...nuevoUsuario
      }

      const token =
        crearToken(
          usuarioCreado
        )

      res
        .status(201)
        .json({
          mensaje:
            'Cuenta creada correctamente',

          token,

          usuario: {
            id:
              resultado
                .insertedId
                .toString(),

            nombre:
              usuarioCreado.nombre,

            email:
              usuarioCreado.email,

            foto:
              usuarioCreado.foto,

            biografia:
              usuarioCreado.biografia
          }
        })
    } catch (error) {
      console.error(error)

      res
        .status(500)
        .json({
          mensaje:
            'Error interno del servidor'
        })
    }
  }
)

app.post(
  '/api/auth/login',
  async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body

      if (
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            mensaje:
              'Email y contraseña son obligatorios'
          })
      }

      const emailNormalizado =
        email
          .trim()
          .toLowerCase()

      const usuario =
        await users.findOne({
          email:
            emailNormalizado
        })

      if (!usuario) {
        return res
          .status(401)
          .json({
            mensaje:
              'Correo o contraseña incorrectos'
          })
      }

      const passwordCorrecta =
        await bcrypt.compare(
          password,
          usuario.password
        )

      if (!passwordCorrecta) {
        return res
          .status(401)
          .json({
            mensaje:
              'Correo o contraseña incorrectos'
          })
      }

      const token =
        crearToken(usuario)

      res.json({
        mensaje:
          'Inicio de sesión correcto',

        token,

        usuario: {
          id:
            usuario._id.toString(),

          nombre:
            usuario.nombre,

          email:
            usuario.email,

          foto:
            usuario.foto,

          biografia:
            usuario.biografia
        }
      })
    } catch (error) {
      console.error(error)

      res
        .status(500)
        .json({
          mensaje:
            'Error interno del servidor'
        })
    }
  }
)

app.get(
  '/api/auth/me',
  autenticar,
  (req, res) => {
    res.json({
      usuario: {
        id:
          req.usuario._id.toString(),

        nombre:
          req.usuario.nombre,

        email:
          req.usuario.email,

        foto:
          req.usuario.foto,

        biografia:
          req.usuario.biografia
      }
    })
  }
)

async function iniciarServidor() {
  try {
    await client.connect()

    const db =
      client.db('Vortex')

    users =
      db.collection(
        'users'
      )

    planets =
      db.collection(
        'planets'
      )

    customPlanets =
      db.collection(
        'custom_planets'
      )

    await users.createIndex(
      {
        email: 1
      },
      {
        unique: true
      }
    )

    await customPlanets.createIndex(
      {
        user_id: 1
      }
    )

    await customPlanets.createIndex(
      {
        publico: 1,
        fechaCreacion: -1
      }
    )

    console.log(
      '✅ Conectado a MongoDB Atlas'
    )

    app.listen(
      PORT,
      () => {
        console.log(
          `🚀 Backend ejecutándose en http://localhost:${PORT}`
        )
      }
    )
  } catch (error) {
    console.error(
      '❌ Error al iniciar el backend:',
      error.message
    )

    process.exit(1)
  }
}

iniciarServidor()