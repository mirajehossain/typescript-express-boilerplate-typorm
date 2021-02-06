import {getRepository} from "typeorm";
import { Request, Response} from "express";
import {User} from "../../../../entity/User";

export class UserController {

    async getUsers(request: Request, response: Response) {
        const userRepository = getRepository(User);
        const users = await userRepository.find();
        console.log(users)
        return response.send({
            success: true,
            message: 'All users',
            data: users
        });
    }

    async getUser(request: Request, response: Response) {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(request.params.id);
        return response.send({
            success: true,
            message: 'user details',
            data: user
        });
    }

    async addUser(request: Request, response: Response) {
        const userRepository = getRepository(User);
        const user = await userRepository.save(request.body);
        return response.send({
            success: true,
            message: 'user created',
            data: user
        });
    }

    async removeUser(request: Request, response: Response) {

        const userRepository = getRepository(User);
        let userToRemove = await userRepository.findOne(request.params.id);
        await userRepository.remove(userToRemove);
        return response.send({
            success: true,
            message: 'user deleted',
        });
    }

}
