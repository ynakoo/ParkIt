require('dotenv').config();
const express = require('express')
const app = express()
const PORT = process.env.PORT
app.use(express.json())
app.listen(PORT,()=>{
    console.log('koyna_ka_server_chl_gya')
})