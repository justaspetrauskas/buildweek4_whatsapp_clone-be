import express from "express";
import createHttpError from "http-errors";
import usermodel from "./schema.js"
import { basicAuthMiddleware } from "../Authorize/basic.js";

const userRouter = express.Router() 

userRouter.post("/", async(req, res, next) => {
    try {
        const newuser = new usermodel(req.body)
        const {_id} = newuser.save()
        res.status(200).send({message: "user created successfully!!"})
    } catch (error) {
        next(error)
    }
})
userRouter.get("/", async(req, res, next) => {
    try {
        const AllUsers = await usermodel.find()
        res.send(AllUsers)
    } catch (error) {
        next(error)
    }
    
})
userRouter.put("/:id", async(req, res, next) => {
   try {
    const updateuser = await usermodel.findByIdAndUpdate(req.params.id, req.body)
    if(updateuser) res.send(updateuser)
    else next(createHttpError(404, `user with id ${req.params.id} is not found`))
   } catch (error) {
       next(error)
   }
})
userRouter.get("/:id", basicAuthMiddleware, async(req, res, next) => {
    try {
        const eachuser = await usermodel.findById(req.params.id)
        if(eachuser) res.send(eachuser)
        else next(createHttpError(404, `user with id ${req.params.id} is not found`))
    } catch (error) {
        next(error)
    }
})
userRouter.delete("/:id", async(req, res, next) => {
    try {
       const deleteuser = await usermodel.findByIdAndDelete(req.params.id) 
       if(deleteuser) res.send({message: "user Deleted Successfully!!"})
        else next(createHttpError(404, `user with id ${req.params.id} is not found` ))
    } catch (error) {
        next(error)
    }
})

export default userRouter;

