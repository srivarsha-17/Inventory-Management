const mongoose = require('mongoose')

const mongo_url = process.env.MONGO_CONN

if (!mongo_url) {
    console.error('ERROR: MONGO_CONN environment variable is not defined!')
    process.exit(1)
}

console.log('Attempting to connect to MongoDB...')
console.log('MongoDB URL:', mongo_url.substring(0, 50) + '...')

mongoose.connect(mongo_url).then(() => {
    console.log('✅ Mongoose connected successfully!')
}).catch((err) => {
    console.error('❌ Mongoose connection error:', err.message)
    console.error('Full error:', err)
    process.exit(1)
})



