import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meRouter from "./me";
import bookmarksRouter from "./bookmarks";
import progressRouter from "./progress";
import recentRouter from "./recent";
import notificationsRouter from "./notifications";
import resourcesRouter from "./resources";
import newsRouter from "./news";
import communityRouter from "./community";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meRouter);
router.use(bookmarksRouter);
router.use(progressRouter);
router.use(recentRouter);
router.use(notificationsRouter);
router.use(resourcesRouter);
router.use(newsRouter);
router.use(communityRouter);
router.use(adminRouter);

export default router;
