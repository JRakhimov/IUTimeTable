import { Router } from "express";

import { authCheck } from "../../middlewares";
import { friends } from "../../controllers";

const router = Router();

router.delete("/:studentID", authCheck.student, friends.remove);
router.post("/:studentID", authCheck.student, friends.add);
router.get("/:studentID", authCheck.student, friends.get);

export default router;
