import React from 'react'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-gray-800">Your Logo</div>
            <div className="space-x-4">
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900">Home</button>
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900">About</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Our App</h1>
        <p className="text-lg text-gray-600">
          This is a basic layout using Tailwind CSS. Feel free to customize it further!
        </p>
      </main>
    </div>
  )
}

export default App