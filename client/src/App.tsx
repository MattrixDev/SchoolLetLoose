import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/Header';
import { Lobby } from './pages/Lobby';
import { Game } from './pages/Game';
import { CardBuilder } from './pages/CardBuilder';
import { Collection } from './pages/Collection';
import { DeckBuilder } from './pages/DeckBuilder';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Admin } from './pages/Admin';
import { AbilityBuilder } from './pages/AbilityBuilder';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="text-center max-w-4xl px-8">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          🎓 School Let Loose
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Welcome to the magical world of school-themed cards! Build your deck using different school subjects as mana types and compete in strategic battles.
        </p>
        
        {isAuthenticated ? (
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/lobby">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                🏛️ Join Lobby
              </button>
            </Link>
            <Link to="/card-builder">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                🎨 Card Builder
              </button>
            </Link>
            <Link to="/collection">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                📚 Collection
              </button>
            </Link>
            <Link to="/deck-builder">
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                🃏 Deck Builder
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                🔐 Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                📝 Register
              </button>
            </Link>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-7 gap-4 text-center">
          <div className="bg-blue-600/20 p-4 rounded-lg">
            <div className="text-2xl mb-2">📘</div>
            <div className="font-semibold text-blue-300">Math</div>
            <div className="text-sm text-gray-400">Blue Mana</div>
          </div>
          <div className="bg-red-600/20 p-4 rounded-lg">
            <div className="text-2xl mb-2">🇩🇪</div>
            <div className="font-semibold text-red-300">German</div>
            <div className="text-sm text-gray-400">Red Mana</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold text-gray-300">English</div>
            <div className="text-sm text-gray-400">Black Mana</div>
          </div>
          <div className="bg-green-600/20 p-4 rounded-lg">
            <div className="text-2xl mb-2">🇫🇷</div>
            <div className="font-semibold text-green-300">French</div>
            <div className="text-sm text-gray-400">Green Mana</div>
          </div>
          <div className="bg-amber-600/20 p-4 rounded-lg">
            <div className="text-2xl mb-2">📜</div>
            <div className="font-semibold text-amber-300">Latin</div>
            <div className="text-sm text-gray-400">Green Mana</div>
          </div>
          <div className="bg-yellow-600/20 p-4 rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-yellow-300">Differentiation</div>
            <div className="text-sm text-gray-400">White Mana</div>
          </div>
          <div className="bg-gray-600/20 p-4 rounded-lg">
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold text-gray-300">Learning</div>
            <div className="text-sm text-gray-400">Colorless Mana</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/lobby" 
              element={
                <ProtectedRoute>
                  <Lobby />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/game/:roomId" 
              element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/card-builder" 
              element={
                <ProtectedRoute>
                  <CardBuilder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/collection" 
              element={
                <ProtectedRoute>
                  <Collection />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/deck-builder" 
              element={
                <ProtectedRoute>
                  <DeckBuilder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireRole="admin">
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ability-builder" 
              element={
                <ProtectedRoute requireRole="creator">
                  <AbilityBuilder />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
