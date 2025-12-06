import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({
    name: 'WeightBro API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      docs: '/api/v1/docs'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/v1', (req, res) => {
  res.json({
    message: 'WeightBro API v1',
    endpoints: {
      auth: {
        signup: 'POST /api/v1/auth/signup',
        login: 'POST /api/v1/auth/login',
        logout: 'POST /api/v1/auth/logout',
        me: 'GET /api/v1/auth/me'
      },
      users: {
        profile: 'GET /api/v1/users/profile',
        updateProfile: 'PUT /api/v1/users/profile',
        onboarding: 'POST /api/v1/users/onboarding',
        deleteProfile: 'DELETE /api/v1/users/profile'
      },
      ai: {
        suggestGoal: 'POST /api/v1/ai/suggest-goal',
        generatePlan: 'POST /api/v1/ai/generate-plan',
        nextPhase: 'POST /api/v1/ai/next-phase'
      },
      plans: {
        active: 'GET /api/v1/plans/active'
      },
      meals: {
        toggle: 'PATCH /api/v1/meals/:id/toggle'
      },
      progress: {
        stats: 'GET /api/v1/progress/stats',
        adherence: 'GET /api/v1/progress/adherence'
      },
      chat: {
        history: 'GET /api/v1/chat/history',
        message: 'POST /api/v1/chat/message',
        clearHistory: 'DELETE /api/v1/chat/history'
      }
    }
  });
});

app.use('/api/v1', routes);

app.use(errorHandler);

export default app;
