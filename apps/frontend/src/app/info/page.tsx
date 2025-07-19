import HealthCard from '../../components/dashboard/HealthCard';

/**
 * Home page component - Main landing page for the Grade Management System
 * Demonstrates integration between frontend and backend services
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Grade Management System
              </h1>
              <p className="mt-2 text-gray-600">
                OpenHearing - Full Stack Mono-repo Demo
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Next.js 15
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Nest.js
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                PostgreSQL
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-8 h-105">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to the Demo
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>This is a full-stack mono-repo demonstration featuring:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Frontend:</strong> Next.js 15 with TypeScript and
                  Tailwind CSS
                </li>
                <li>
                  <strong>Backend:</strong> Nest.js with TypeORM and PostgreSQL
                </li>
                <li>
                  <strong>Database:</strong> PostgreSQL running in Docker
                </li>
                <li>
                  <strong>DevOps:</strong> Docker Compose for full-stack
                  deployment
                </li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Quick Start:
                </h3>
                <code className="text-sm text-blue-700">npm run dev</code>
                <p className="text-sm text-blue-600 mt-2">
                  This command will start the entire stack (frontend, backend,
                  and database)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <HealthCard />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              TypeScript
            </h3>
            <p className="text-gray-600 text-sm">
              Full type safety across the entire stack with shared interfaces
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Database
            </h3>
            <p className="text-gray-600 text-sm">
              PostgreSQL with TypeORM for robust data persistence
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Docker</h3>
            <p className="text-gray-600 text-sm">
              Containerized deployment with Docker Compose
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>
              Built with ❤️ using Next.js, Nest.js, TypeORM, and PostgreSQL by
              Abhishek
            </p>
            <p className="mt-1">
              Mono-repo architecture with Docker containerization
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
