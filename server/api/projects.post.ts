import { nanoid } from 'nanoid'
import { connectToDatabase } from '~~/server/utils/mongodb'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { data, projectId } = body

    if (!data) {
      throw createError({
        statusCode: 400,
        message: 'data is required'
      })
    }

    const db = await connectToDatabase()
    const collection = db.collection('projects')

    if (projectId) {
      const result = await collection.updateOne(
        { projectId },
        {
          $set: {
            data,
            projectName: data.projectName || '',
            projectNameTechnical: data.projectNameTechnical || '',
            updatedAt: new Date()
          }
        }
      )

      if (result.matchedCount === 0) {
        throw createError({
          statusCode: 404,
          message: 'Project not found'
        })
      }

      return { success: true, projectId }
    }

    const newProjectId = nanoid(10)
    await collection.insertOne({
      projectId: newProjectId,
      projectName: data.projectName || '',
      projectNameTechnical: data.projectNameTechnical || '',
      data,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return { success: true, projectId: newProjectId }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    console.error('Error saving project:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to save project'
    })
  }
})
