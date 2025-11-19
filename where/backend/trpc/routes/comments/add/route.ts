import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const S5_BASE_URL = process.env.S5_BASE_URL ?? "https://where-app.com";
const S5_ADMIN_API_KEY = process.env.S5_ADMIN_API_KEY ?? "HvFNPSxB8h4dRPLM7bti9NnqzJfqboj9G792bLBmGzLR";

export default publicProcedure
  .input(
    z.object({
      comment: z.object({
        id: z.string(),
        userId: z.string(),
        username: z.string().nullable(),
        isAnonymous: z.boolean(),
        text: z.string(),
        createdAt: z.number(),
      }),
      locationId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const jsonBlob = new Blob([JSON.stringify(input.comment)], {
      type: "application/json",
    });

    const formData = new FormData();
    formData.append("file", jsonBlob, `comment-${input.comment.id}.json`);

    const res = await fetch(`${S5_BASE_URL}/s5/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${S5_ADMIN_API_KEY}`,
      },
      body: formData as unknown as BodyInit,
    });

    if (!res.ok) {
      throw new Error("Failed to store comment on S5");
    }

    const cid = (await res.text()).trim();

    return {
      comment: input.comment,
      cid,
      gatewayUrl: `${S5_BASE_URL}/s5/gateway/${cid}`,
    };
  });
