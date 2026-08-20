const { MongoClient } = require('mongodb')
require('dotenv').config()

const uri = process.env.MONGODB_URI

if (!uri) {
  console.error('❌ No se encontró MONGODB_URI en el archivo .env')
  process.exit(1)
}

const client = new MongoClient(uri)

async function conectarMongoDB() {
  try {
    await client.connect()
    console.log('✅ Conexión exitosa con MongoDB Atlas')
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
  } finally {
    await client.close()
  }
}

conectarMongoDB()