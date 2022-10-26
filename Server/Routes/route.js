const express=require('express');
const path=require('path');
const Router=express.Router();



Router.get('/schedule',(req,res)=>{
    res.send("This is Schedule page");
})

Router.get('/points',(req,res)=>{
    res.send("This is Points Table page");
})
Router.get('/about',(req,res)=>{
    res.send("This is About page");
})



module.exports=Router;