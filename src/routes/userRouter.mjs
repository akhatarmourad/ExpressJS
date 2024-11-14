import { Router } from 'express';

export const userRouter = Router();

userRouter.get('/api/v1/users', async (request, response) => {
    return response.status(200).send({message: "Users API is working !"});
});