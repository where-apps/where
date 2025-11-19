import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import createLocationRoute from "./routes/locations/create/route";
import listLocationsRoute from "./routes/locations/list/route";
import getLocationRoute from "./routes/locations/get/route";
import updateLocationRoute from "./routes/locations/update/route";
import addCommentRoute from "./routes/comments/add/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  locations: createTRPCRouter({
    create: createLocationRoute,
    list: listLocationsRoute,
    get: getLocationRoute,
    update: updateLocationRoute,
  }),
  comments: createTRPCRouter({
    add: addCommentRoute,
  }),
});

export type AppRouter = typeof appRouter;
