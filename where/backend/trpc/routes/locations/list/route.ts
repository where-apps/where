import { publicProcedure } from "@/backend/trpc/create-context";

export default publicProcedure.query(() => {
  return {
    locations: [],
    message: "Locations are stored on S5. Use location CIDs to fetch them.",
  };
});
