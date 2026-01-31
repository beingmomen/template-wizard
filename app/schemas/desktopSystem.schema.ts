import { z } from 'zod'

export const desktopSystemSchema = z.object({
  desktopSystemCapabilities: z.object({
    fileSystemAccess: z.boolean(),
    microphone: z.boolean(),
    camera: z.boolean(),
    globalShortcuts: z.boolean(),
    backgroundExecution: z.boolean(),
    autoStart: z.boolean()
  })
})

export type DesktopSystemData = z.infer<typeof desktopSystemSchema>
