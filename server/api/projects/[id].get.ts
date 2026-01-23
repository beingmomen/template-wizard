import { connectToDatabase } from '~~/server/utils/mongodb'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'id')
    const query = getQuery(event)
    const deviceId = query.deviceId as string

    if (!projectId) {
      throw createError({
        statusCode: 400,
        message: 'projectId is required'
      })
    }

    if (!deviceId) {
      throw createError({
        statusCode: 400,
        message: 'deviceId is required'
      })
    }

    const db = await connectToDatabase()
    const project = await db.collection('projects').findOne(
      { projectId, deviceId },
      { projection: { _id: 0 } }
    )

    if (!project) {
      throw createError({
        statusCode: 404,
        message: 'Project not found'
      })
    }

    return { project }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    console.error('Error fetching project:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch project'
    })
  }
})
