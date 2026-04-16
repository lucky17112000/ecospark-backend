/*

export interface IcreateIdeaPayload {
  title: string;
  problemStatement: string;
  solutinon: string;
  description: string;
  images?: string[];
  categoryId: string;
  authorId: string;
  price?: number;
}
*/

import z from "zod";

const createIdeaZodSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  problemStatement: z
    .string()
    .min(10, "Problem statement must be at least 10 characters long"),
  solutinon: z.string().min(10, "Solution must be at least 10 characters long"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long"),
  // images: z.array(z.string()).optional(),
  categoryId: z.string(),
  authorId: z.string(),
  price: z.number().positive("Price must be a positive number").optional(),
});

export const ideaValidator = {
  createIdeaZodSchema,
};
