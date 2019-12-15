// Load Express Module : Returns a function
const express = require ('express');

//Loading Joi Module for input validation : returns a class
const Joi = require('joi');


// When calling the function, it returns object of type express
const app=express();

/*express.json() returns a piece of middleware, then we call app.use
 to use that middleware in the request processing pipeline. */
app.use(express.json());
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
    res.send(`WELCOME TO THE HOMEPAGE OF COURSE MANAGEMENT SYSTEM...`);
});

app.get('/courses',(req,res)=>{
    res.send(courses);
});

app.get('/courses/:id', (req,res)=>{
    const course=courses.find(c=>c.id===parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given Id does not exist.');
    res.send(course);
});

app.post('/courses',(req,res)=>{

    /*Object Destructuring : Since, we are interested in error property, we can get it using object destrucuring.
    With it, when declaring a variable or constant, we add {} and then we add property of target object that we want.
    Here, {error} is equivalent to result.error.
    */
    const {error} = validateSchema(req.body);

    if(error) return  res.status(400).send(error.details[0].message);
    /* In this route handler, we need to read the course object that should be in the 
        the body of the request. Use its property to create a new course object and 
        add that course object to our courses array.*/
      const course={
          id:courses.length + 1,
          name : req.body.name // In order for this line to work, we need to enable 
          //parsing of JSON objects in the body of the request
      };
      courses.push(course);
      //Returning back the new course object
      res.send(course);

});

app.put('/courses/:id', (req,res)=>{
    /* Look up the course. If not existing, return 404.
    Otherwise Validate. If invalid, return 400- Bad Request
    Else update course and return the updated course to client */

    const course=courses.find(c=>c.id===parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given Id does not exist');

    const {error} =validateSchema(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    course.name=req.body.name;
    res.send(course);
});
/*When ee have hardcode the value of port, thouugh it may work in development environment, but we cannot be sure that it works in 
production environment, because the port is dynamically assigned in hosting environment.So, we can't rely on the port to be avaibale. 
So, the way to fix this is by using environment variable.

Typically in hosting environment or node applications, we have the environment variable called PORT.

Env Varaible is a variable that is part of the environment in which a process runs.Its value is set outside the application.
We have the global object called process, which has a property called env, then we give the name of our environment variable, 
which is PORT for us now.

If it is set, we will use it otherwise, we will use 3000.*/

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Listening on port ${port}...`);
});

/* In my machine, if I didn't have environment variable called port, it would use 3000.
Command to set environment variable is : 
export (Mac) /set (Windows) PORT=5000 (To use port with a value of 5000) */

/* With Joi, we need to first define a schema.A schema defines the shape of our object, what properties do we have in that object,
what is the type of each property, do we have an email, or a string, what is the minimum and maximum number of characters. What is 
the range of the number we have ? This is the job of the schema. */

function validateSchema(course){
    const schema={
        name : Joi.string().min(3).required()
    };
 
    //validating the request body
    return Joi.validate(course,schema);
    
}