/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import wardrobeRoutes from './routes/wardrobe.js'
import lookRoutes from './routes/looks.js'
import postRoutes from './routes/posts.js'
import socialRoutes from './routes/social.js'
import mediaRoutes from './routes/media.js'
import recommendationRoutes from './routes/recommendations.js'
import notificationRoutes from './routes/notifications.js'
import storyRoutes from './routes/stories.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/wardrobe', wardrobeRoutes)
app.use('/api/looks', lookRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/social', socialRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/recommendations', recommendationRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/stories', storyRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
