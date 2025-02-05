import { z } from "zod";

export const workflowSchema = z.object({
  name: z.string(),
  on: z.any(),
  jobs: z.record(z.any()),
});

export function validateYaml(yaml: string): boolean {
  try {
    const parsed = JSON.parse(yaml);
    return workflowSchema.safeParse(parsed).success;
  } catch {
    return false;
  }
}
