import Header from '../components/Header'
import PDFUpload from '../components/PDFUpload'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full">
          {/* Tagline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center leading-tight">
            Free, Secure, No Account Needed — Merge and Convert Your Files Instantly.
          </h2>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-700 text-center mb-12">
            All processing happens securely in your browser. We never store your files or personal data.
          </p>

          <PDFUpload />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
