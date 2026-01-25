import { connectToDatabase } from '~~/server/utils/mongodb'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'id')

    if (!projectId) {
      throw createError({
        statusCode: 400,
        message: 'projectId is required'
      })
    }

    const db = await connectToDatabase()
    const result = await db.collection('projects').deleteOne({ projectId })

    if (result.deletedCount === 0) {
      throw createError({
        statusCode: 404,
        message: 'Project not found'
      })
    }

    return { success: true }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    console.error('Failed to delete project:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete project'
    })
  }
})
