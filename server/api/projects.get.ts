import { connectToDatabase } from '~~/server/utils/mongodb'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const deviceId = query.deviceId as string

    if (!deviceId) {
      throw createError({
        statusCode: 400,
        message: 'deviceId is required'
      })
    }

    const db = await connectToDatabase()
    const projects = await db.collection('projects')
      .find({ deviceId })
      .project({
        projectId: 1,
        projectName: 1,
        projectNameTechnical: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0
      })
      .sort({ updatedAt: -1 })
      .toArray()

    return { projects }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    console.error('Error fetching projects:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch projects'
    })
  }
})
