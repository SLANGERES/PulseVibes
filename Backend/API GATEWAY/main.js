//Main API GATEWAY 

const express = require('express')
const axios=require('axios')
const app = express()
const port = 9000


// app.get('/', (req, res) => {
//     res.send('Main Api Gateway')
// })

app.get('/emotions', (req,res)=>{
    res.send('Emotion route')
})


app.get('/',async (req,res)=>{
    try{
        data=await axios.get("https://fakestoreapi.com/products/1")
        if(data!=null){
            console.log(data)
        }
        else{
            console.log("Unable to fetch")
        }
    }
    catch{
        res.send("error...")
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))