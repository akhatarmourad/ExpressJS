import { Router } from "express";
import { userRouter } from "./userRouter.mjs";
import { productRouter } from "./productRouter.mjs";

export const router = Router();

router.use(userRouter);
router.use(productRouter);