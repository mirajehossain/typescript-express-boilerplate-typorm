import * as express from "express";

import {UserController} from "../controller/UserController";

const router = express.Router();

const userController = new UserController();

router.post("/", userController.addUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.delete("/:id", userController.removeUser);


export default router;
