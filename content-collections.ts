import { languages } from "@/data/constants";
import { defineCollection, defineConfig } from "@content-collections/core";

const champion = defineCollection({
  name: "champion",
  directory: ".cache",
  include: "champions.json",
  parser: "json",
  schema: (z) => ({
    lang: z.record(
      z.string(),
      z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          description: z.string(),
        }),
      ),
    ),
  }),
});

export default defineConfig({
  collections: [champion],
});
