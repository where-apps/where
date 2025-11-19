import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const S5_BASE_URL = process.env.S5_BASE_URL ?? "https://where-app.com";

const getLocationInput = z.object({ cid: z.string() });

export default publicProcedure
  .input(getLocationInput)
  .query(async ({ input }: { input: z.infer<typeof getLocationInput> }) => {
    const res = await fetch(`${S5_BASE_URL}/s5/gateway/${input.cid}`);
    
    if (!res.ok) {
      throw new Error("Location not found on S5");
    }

    const location = await res.json();
    return location;
  });
