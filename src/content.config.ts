// Content collection for project case studies.
// Each project is an .mdx file in src/content/projects/ with the frontmatter
// fields below, plus free-form MDX body for the case-study content.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    cover: z.string(),
    ogImage: z.string().optional(),
    year: z.union([z.string(), z.number()]),
    date: z.coerce.date().optional(),
    role: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    artists: z.string().optional(),
    designers: z.string().optional(),
    supervisor: z.string().optional(),
    partner: z.string().optional(),
    client: z.string().optional(),
    organization: z.string().optional(),
    duration: z.string().optional(),
    medium: z.string().optional(),
    awards: z.array(z.string()).optional(),
    highlights: z.array(z.string()).optional(),
    /** Free-form HTML rendered on the right side of the intro section.
     *  Use this for the project overview / intro paragraph. */
    overview: z.string().optional(),
    /** Heading shown above the overview. Defaults to "Project Overview"
     *  (or "Intro" if neither role nor company is set). */
    overviewTitle: z.string().optional(),
    /** Order in which to list this project (lower = earlier). */
    order: z.number().optional(),
  }),
});

export const collections = { projects };
