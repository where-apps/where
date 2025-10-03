import { z } from "zod";
import { publicProcedure } from "@/trpc/create-context";

export default publicProcedure
  .input(z.object({ name: z.string() }))
  .query(({ input }) => {
    return {
      hello: input.name,
      date: new Date(),
    };
  });



