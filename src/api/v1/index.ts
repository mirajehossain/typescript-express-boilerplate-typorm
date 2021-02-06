import * as express from "express";

import userRoutes from "./user/routes";

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by authorization bearer token
// router.use("/", authentication);
/*-------------------------------------------------------------------------*/

router.use("/users", userRoutes);

export default router;
