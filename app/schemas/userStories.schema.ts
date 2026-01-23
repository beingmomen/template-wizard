import { z } from 'zod'

const userStorySchema = z.object({
  story: z.string().min(10, 'القصة يجب أن تكون 10 أحرف على الأقل')
})

const userTypeSchema = z.object({
  userType: z.string().min(2, 'نوع المستخدم مطلوب'),
  stories: z.array(userStorySchema).min(1, 'أضف قصة واحدة على الأقل')
})

export const userStoriesSchema = z.object({
  userTypes: z.array(userTypeSchema).min(1, 'أضف نوع مستخدم واحد على الأقل')
})

export type UserStoriesData = z.infer<typeof userStoriesSchema>
