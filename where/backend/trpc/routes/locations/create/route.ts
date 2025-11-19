import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const S5_BASE_URL = process.env.S5_BASE_URL ?? "https://where-app.com";
const S5_ADMIN_API_KEY = process.env.S5_ADMIN_API_KEY ?? "HvFNPSxB8h4dRPLM7bti9NnqzJfqboj9G792bLBmGzLR";

const createLocationInput = z.object({
  name: z.string(),
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  images: z.array(z.string()),
  createdBy: z.string(),
  isAnonymous: z.boolean(),
  username: z.string().nullable(),
});

export default publicProcedure
  .input(createLocationInput)
  .mutation(async ({ input }: { input: z.infer<typeof createLocationInput> }) => {
    const location = {
      id: `loc_${Date.now()}`,
      name: input.name,
      description: input.description,
      latitude: input.latitude,
      longitude: input.longitude,
      images: input.images,
      allImages: input.images,
      ratings: {
        security: 0,
        violence: 0,
        welcoming: 0,
        streetFood: 0,
        restaurants: 0,
        pickpocketing: 0,
        qualityOfLife: 0,
      },
      ratingCount: 0,
      comments: [],
      createdBy: input.createdBy,
      createdAt: Date.now(),
      verified: false,
      verificationCount: 0,
      contributors: [
        {
          userId: input.createdBy,
          username: input.username,
          isAnonymous: input.isAnonymous,
          contribution: "image" as const,
          createdAt: Date.now(),
        },
      ],
    };

    const jsonBlob = new Blob([JSON.stringify(location)], {
      type: "application/json",
    });

    const formData = new FormData();
    formData.append("file", jsonBlob, `location-${location.id}.json`);

    const res = await fetch(`${S5_BASE_URL}/s5/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${S5_ADMIN_API_KEY}`,
      },
      body: formData as unknown as BodyInit,
    });

    if (!res.ok) {
      throw new Error("Failed to store location on S5");
    }

    const cid = (await res.text()).trim();

    return {
      location,
      cid,
      gatewayUrl: `${S5_BASE_URL}/s5/gateway/${cid}`,
    };
  });
