import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const S5_BASE_URL = process.env.S5_BASE_URL ?? "https://where-app.com";
const S5_ADMIN_API_KEY = process.env.S5_ADMIN_API_KEY ?? "HvFNPSxB8h4dRPLM7bti9NnqzJfqboj9G792bLBmGzLR";

export default publicProcedure
  .input(
    z.object({
      cid: z.string(),
      location: z.any(),
    })
  )
  .mutation(async ({ input }) => {
    const jsonBlob = new Blob([JSON.stringify(input.location)], {
      type: "application/json",
    });

    const formData = new FormData();
    formData.append("file", jsonBlob, `location-${input.location.id}.json`);

    const res = await fetch(`${S5_BASE_URL}/s5/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${S5_ADMIN_API_KEY}`,
      },
      body: formData as unknown as BodyInit,
    });

    if (!res.ok) {
      throw new Error("Failed to update location on S5");
    }

    const newCid = (await res.text()).trim();

    return {
      cid: newCid,
      gatewayUrl: `${S5_BASE_URL}/s5/gateway/${newCid}`,
    };
  });
