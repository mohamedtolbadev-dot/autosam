import { Link } from 'react-router-dom';
import { Home, Search, Car } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600 mb-4">404</h1>
          <div className="flex justify-center mb-6">
            <Car className="w-32 h-32 text-gray-300" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Oups ! Page introuvable
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
          Mais ne vous inquiétez pas, nous pouvons vous aider à retrouver votre chemin !
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <Link 
            to="/cars"
            className="inline-flex items-center justify-center gap-2 bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
          >
            <Search className="w-5 h-5" />
            Voir les véhicules
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Pages populaires :</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/cars" className="text-red-600 hover:text-red-700 text-sm font-medium">
              Nos véhicules
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/about" className="text-red-600 hover:text-red-700 text-sm font-medium">
              À propos
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/contact" className="text-red-600 hover:text-red-700 text-sm font-medium">
              Contact
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/booking" className="text-red-600 hover:text-red-700 text-sm font-medium">
              Réserver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;