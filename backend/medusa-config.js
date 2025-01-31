import { loadEnv, Modules, defineConfig } from '@medusajs/utils';

// Load environment variables
loadEnv(process.env.NODE_ENV, process.cwd());

// Import constants
import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
  REDIS_URL,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  SHOULD_DISABLE_ADMIN,
  STORE_CORS,
  STRIPE_API_KEY,
  STRIPE_WEBHOOK_SECRET,
  WORKER_MODE,
  MINIO_ENDPOINT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET,
  MINIO_REGION,
  MINIO_PORT,
  MEILISEARCH_HOST,
  MEILISEARCH_API_KEY
} from 'lib/constants';

// ✅ Medusa Project Configuration
const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      storeCors: STORE_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET,
    },
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
  },
  modules: [
    // ✅ File Storage (MinIO)
    ...(MINIO_ENDPOINT && MINIO_ACCESS_KEY && MINIO_SECRET_KEY
      ? [
          {
            key: Modules.FILE,
            resolve: '@medusajs/file',
            options: {
              providers: [
                {
                  resolve: '@medusajs/file-minio',
                  id: 'minio',
                  options: {
                    endPoint: MINIO_ENDPOINT,
                    accessKey: MINIO_ACCESS_KEY,
                    secretKey: MINIO_SECRET_KEY,
                    bucket: MINIO_BUCKET || 'medusa-media',
                    region: MINIO_REGION || 'us-east-1',
                    port: MINIO_PORT || 443,
                    s3_force_path_style: true,
                    signature_version: 'v4',
                  },
                },
              ],
            },
          },
        ]
      : []
    ),

    // ✅ Event Bus and Workflow Engine (Redis)
    ...(REDIS_URL
      ? [
          {
            key: Modules.EVENT_BUS,
            resolve: '@medusajs/event-bus-redis',
            options: { redisUrl: REDIS_URL },
          },
          {
            key: Modules.WORKFLOW_ENGINE,
            resolve: '@medusajs/workflow-engine-redis',
            options: { redis: { url: REDIS_URL } },
          },
        ]
      : []
    ),

    // ✅ Email Notifications (Resend or SendGrid)
    ...(SENDGRID_API_KEY || RESEND_API_KEY
      ? [
          {
            key: Modules.NOTIFICATION,
            resolve: '@medusajs/notification',
            options: {
              providers: [
                ...(SENDGRID_API_KEY
                  ? [
                      {
                        resolve: '@medusajs/notification-sendgrid',
                        id: 'sendgrid',
                        options: {
                          channels: ['email'],
                          api_key: SENDGRID_API_KEY,
                          from: SENDGRID_FROM_EMAIL,
                        },
                      },
                    ]
                  : []),
                ...(RESEND_API_KEY
                  ? [
                      {
                        resolve: './src/modules/email-notifications',
                        id: 'resend',
                        options: {
                          channels: ['email'],
                          api_key: RESEND_API_KEY,
                          from: RESEND_FROM_EMAIL,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        ]
      : []
    ),

    // ✅ Payment Gateway (Stripe)
    ...(STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET
      ? [
          {
            key: Modules.PAYMENT,
            resolve: '@medusajs/payment',
            options: {
              providers: [
                {
                  resolve: '@medusajs/payment-stripe',
                  id: 'stripe',
                  options: {
                    apiKey: STRIPE_API_KEY,
                    webhookSecret: STRIPE_WEBHOOK_SECRET,
                  },
                },
              ],
            },
          },
        ]
      : []
    ),

    // ✅ Search Engine (MeiliSearch)
    ...(MEILISEARCH_HOST && MEILISEARCH_API_KEY
      ? [
          {
            resolve: '@rokmohar/medusa-plugin-meilisearch',
            options: {
              config: {
                host: MEILISEARCH_HOST,
                apiKey: MEILISEARCH_API_KEY,
              },
              settings: {
                products: {
                  indexSettings: {
                    searchableAttributes: ['title', 'description', 'variant_sku'],
                    displayedAttributes: ['id', 'title', 'description', 'variant_sku', 'thumbnail', 'handle'],
                  },
                  primaryKey: 'id',
                },
              },
            },
          },
        ]
      : []
    ),
  ],
  plugins: [],
};

// ✅ Export Configuration
export default defineConfig(medusaConfig);
