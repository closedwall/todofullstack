import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from 'lodash';

const app = express();
// const port = 3000;
let task;
let days=["Sunday","Monday","Tuesday","Wednesdat","Thrusday","Friday","Saturday"];

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("public"));

//connnecting to database
mongoose.connect("mongodb+srv://yadavrajesh5612:test123@cluster0.wiw8apf.mongodb.net/todolistDB");
console.log("connected to db");
// creating schema of the listItem
const todoSchema = {
    name:String
};

const Todolist = mongoose.model("Todolist",todoSchema);

const item1 = new Todolist({
    name:"Welcome to todo list"
});
const item2 = new Todolist({
    name:"this is second item"
});
const item3 = new Todolist({
    name:"this is third item"
});
const itemArr = [item1, item2, item3];

const listSchema={
    name:String,
    items:[todoSchema]
}
const List = mongoose.model("List",listSchema);


app.get('/',async(req,res)=>{
    let todolist = await Todolist.find({});
    if(todolist.length===0){
        Todolist.insertMany(itemArr);
        res.redirect("/");
    }else{
        res.render("index.ejs",{heading:"Today",todo:todolist})
    }
})

app.get("/:urlRoute",async(req,res)=>{
    const name = _.capitalize(req.params.urlRoute);
    const listcontent = await List.findOne({name:name}).exec();
    // console.log(listcontent);
    if(!listcontent){
        const list = new List({
            name:name,
            items:itemArr
        });
        list.save();
        res.redirect(`/${name}`);
    }else{
        res.render("index.ejs",{heading:listcontent.name,todo:listcontent.items});
    }
});

app.post('/',async(req,res)=>{
    const itemName = req.body["newItem"];
    const title = req.body.list;
    const newItem = new Todolist({
        name:itemName
    });
    if(title==="Today"){
        newItem.save();
        res.redirect("/");
    }else{
        let found = await List.findOne({name: title});
        found.items.push(newItem);
        found.save();
        res.redirect(`/${title}`);
    }
});


app.post("/delete",async(req,res)=>{
    const idToDelete = req.body.checkbox;
    const title = req.body.title;
    if(title==="Today"){
        const returnedObj = await Todolist.findByIdAndRemove(idToDelete)
        res.redirect("/");
    }else{
        const val = await List.findOneAndUpdate({name:title},{$pull: {items:{_id:idToDelete}}});
        res.redirect(`/${title}`);
    }
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,(req,res)=>{
    console.log(`The server is running on port: ${port}`);
})