import { Router } from 'express';

export const userRouter = Router();

export const getAllUsers = userRouter.get('/api/v1/users', async (request, response) => {
    response.cookie("data", "Cookie Content goes here....", { maxAge: 1000 * 60 });
    console.log(request.headers.cookie);
    console.log(request.cookies);

    if(request.cookies.data && request.cookies.data === "Cookie Content goes here...") {
        return response.status(200).send({message: "Cookies are working !"});
    }

    return response.status(400).send({message: "Users API is working ! But cookies don't !"});
});