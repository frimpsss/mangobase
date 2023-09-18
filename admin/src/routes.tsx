import CollectionDetail, { CollectionRecords } from './pages/collections/[name]'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import AppError from './lib/app-error'
import Collection from './client/collection'
import CollectionEmptyState from './components/collections-empty-state'
import CollectionHooks from './pages/collections/[name]/hooks'
import CollectionsPage from './pages/collections'
import Devs from './pages/settings/devs'
import Edit from './pages/collections/[name]/edit'
import { LoaderErrorBoundary } from './components/general-error'
import Login from './pages/login'
import Logs from './pages/logs'
import Profile from './pages/settings/profile'
import Schemas from './pages/settings/schemas'
import Settings from './pages/settings'
import Wip from './pages/wip'
import app from './mangobase-app'
import { loadCollections } from './data/collections'

interface CollectionRouteData {
  collection: Collection
}

const routes = createBrowserRouter(
  [
    {
      children: [
        {
          children: [
            {
              children: [
                {
                  element: <CollectionRecords />,
                  path: '',
                },
                {
                  element: <CollectionHooks />,
                  path: 'hooks',
                },
                {
                  element: <Edit />,
                  path: 'edit',
                },
              ],
              element: <CollectionDetail />,
              id: 'collection',
              loader: async ({ params }) => {
                try {
                  const collection = await app.collection(params.name!)
                  return { collection }
                } catch (err) {
                  throw new AppError((err as any).message || '', err)
                }
              },
              path: ':name',
            },
            {
              element: <CollectionEmptyState />,
              path: '',
            },
          ],
          element: <CollectionsPage />,
          loader: async () => {
            try {
              await loadCollections()
              return null
            } catch (err) {
              throw new AppError((err as any).message, err)
            }
          },
          path: 'collections',
        },
        {
          element: <Logs />,
          path: 'logs',
        },
        {
          children: [
            {
              element: <Schemas />,
              path: 'schemas',
            },
            {
              element: <Profile />,
              path: 'profile',
            },
            {
              element: <Devs />,
              path: 'devs',
            },
            {
              element: <Navigate to="devs" replace />,
              path: '',
            },
          ],
          element: <Settings />,
          path: 'settings',
        },
        {
          element: <Wip />,
          path: '*',
        },
        {
          element: <Navigate replace to="/collections" />,
          path: '',
        },
      ],
      element: <AdminLayout />,
      errorElement: <LoaderErrorBoundary />,
      path: '',
    },
    {
      element: <Login />,
      path: 'login',
    },
    {
      element: <>Come back later, after!</>,
      path: '*',
    },
  ],
  {
    basename: '/_',
  }
)

export default routes
export type { CollectionRouteData }
