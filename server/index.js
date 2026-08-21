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
    origin: 'http://localhost:5173'
  })
)

app.use(
  express.json()
)

let users
let planets

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

/* =====================================
   PLANETAS
===================================== */

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

/* =====================================
   REGISTRO
===================================== */

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

/* =====================================
   LOGIN
===================================== */

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

/* =====================================
   SESIÓN ACTUAL
===================================== */

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

/* =====================================
   INICIO DEL SERVIDOR
===================================== */

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

    await users.createIndex(
      {
        email: 1
      },
      {
        unique: true
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