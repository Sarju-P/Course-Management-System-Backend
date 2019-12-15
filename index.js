// Load Express Module : Returns a function
const express = require ('express');

// When calling the function, it returns object of type express
const app=express();

const courses= [
    {
        id:1, name: 'course 1'
    },
    {
        id:2, name: 'course 2'
    },
    {
        id:3, name: 'course 3'
    }
]
// app object has bunch of useful methods like get/post/put and delete
app.get('/', (req,res)=> {
    res.send(courses);
});

app.listen(3000,()=>{
    console.log('Listening on port 3000');
});