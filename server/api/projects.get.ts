import { connectToDatabase } from '~~/server/utils/mongodb'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 5
    const status = query.status as string | undefined
    const archived = query.archived === 'true'
    const countOnly = query.countOnly === 'true'

    const skip = (page - 1) * limit

    const db = await connectToDatabase()
    const collection = db.collection('projects')

    const notDeletedFilter = {
      $or: [
        { 'data.deletedAt': { $exists: false } },
        { 'data.deletedAt': null }
      ]
    }

    const archivedFilter = {
      'data.deletedAt': { $exists: true, $ne: null }
    }

    let filter
    if (archived) {
      filter = archivedFilter
    } else if (status) {
      filter = { ...notDeletedFilter, 'data.projectStatus': status }
    } else {
      filter = notDeletedFilter
    }

    if (countOnly) {
      const [totalAll, totalPlanning, totalPlanned, totalCompleted, totalArchived] = await Promise.all([
        collection.countDocuments(notDeletedFilter),
        collection.countDocuments({ ...notDeletedFilter, 'data.projectStatus': 'planning' }),
        collection.countDocuments({ ...notDeletedFilter, 'data.projectStatus': 'planned' }),
        collection.countDocuments({ ...notDeletedFilter, 'data.projectStatus': 'completed' }),
        collection.countDocuments(archivedFilter)
      ])

      return {
        counts: {
          all: totalAll,
          planning: totalPlanning,
          planned: totalPlanned,
          completed: totalCompleted,
          archived: totalArchived
        }
      }
    }

    const [projects, total] = await Promise.all([
      collection
        .find(filter)
        .project({
          projectId: 1,
          projectName: 1,
          projectNameTechnical: 1,
          'data.projectStatus': 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 0
        })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter)
    ])

    const formattedProjects = projects.map(p => ({
      projectId: p.projectId,
      projectName: p.projectName,
      projectNameTechnical: p.projectNameTechnical,
      projectStatus: p.data?.projectStatus || 'planning',
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }))

    return {
      projects: formattedProjects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
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
