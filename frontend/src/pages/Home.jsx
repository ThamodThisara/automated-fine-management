import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero Section */}
      <div className="min-h-screen bg-cover bg-no-repeat bg-center relative overflow-hidden bg-[url('/hero.jpg')]">
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4">
          <h4 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 mt-32 animate-fade-in">
            Fine Issue And Online Payment System <br />
            <span className="text-blue-300">For Sri Lanka Police</span>
          </h4>

          {/* Description Box */}
          <div className="max-w-4xl mx-auto bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-6 md:p-8 shadow-2xl animate-slide-up">
            <p className="text-base md:text-lg text-justify leading-relaxed text-gray-100">
              Fine Issue And Online Payment System For Sri Lanka Police aims to
              modernize how traffic fines are handled, providing a convenient
              online payment system for drivers to pay fines securely.
              Additionally, police officers can issue penalty sheets directly
              through the system, streamlining the process of managing
              violations. This system helps improve efficiency, reduce manual
              work, and ensure timely reminders for unpaid fines.
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="mt-16 flex flex-col md:flex-row gap-6 animate-fade-in pb-10">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate("/payment")}
            >
              Pay Your Fines
            </button>
            <button
              className="bg-transparent border-2 border-blue-600 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate("/search")}
            >
              Explore More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose Our System?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-blue-400 text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Efficiency
              </h3>
              <p className="text-gray-300">
                Streamline traffic violation management and real-time updates.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-blue-400 text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Convenience
              </h3>
              <p className="text-gray-300">
                Pay fines online securely and receive timely reminders for
                unpaid violations.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-blue-400 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Transparency
              </h3>
              <p className="text-gray-300">
                Track your violations and payments with a clear, user-friendly
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
