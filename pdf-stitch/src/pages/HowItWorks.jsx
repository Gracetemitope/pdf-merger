import Header from '../components/Header'
import Footer from '../components/Footer'

function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Header />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              How It Works
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
              PDF Stitch makes it easy to merge and convert your files. All processing happens securely in your browser—we never see or store your files.
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  100% Client-Side Processing
                </h3>
                <p className="text-sm sm:text-base text-blue-800">
                  Your files are processed entirely in your browser. We never upload, store, or access your files. Your privacy and security are our top priorities.
                </p>
              </div>
            </div>
          </div>

          {/* Merge PDF Section */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Merge PDF Files
              </h2>
              <p className="text-lg text-gray-700">
                Combine multiple PDF documents into one seamless file
              </p>
            </div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  1
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Upload Your PDF Files
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Drag and drop or click to browse and select 2 or more PDF files you want to merge. You can upload multiple files at once.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Supports: PDF files only</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  2
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Review and Confirm
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Review your uploaded files. You can remove individual files or clear all. When ready, click "Merge Now" to proceed.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Minimum 2 PDF files required</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  3
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Download Your Merged PDF
                  </h3>
                  <p className="text-gray-700">
                    Once processing is complete, your merged PDF will be ready for download. Click the download button to save it to your device.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Convert to PDF Section */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Convert to PDF
              </h2>
              <p className="text-lg text-gray-700">
                Transform your documents and images into PDF format
              </p>
            </div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  1
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Upload Files to Convert
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Select DOC, DOCX, or JPEG files you want to convert to PDF. You can upload multiple files at once.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      DOC
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      DOCX
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      JPEG/JPG
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  2
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Automatic Conversion
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Click "Convert Now" and watch as your files are converted to PDF format. The conversion happens instantly in your browser.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Fast, client-side processing</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  3
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Download Your PDFs
                  </h3>
                  <p className="text-gray-700">
                    If you converted multiple files, they'll be automatically merged into one PDF. Download your converted file and you're done!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Why Choose PDF Stitch?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Secure</h3>
                <p className="text-sm text-gray-700">
                  All processing happens in your browser. No uploads, no storage, no tracking.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-700">
                  Process files instantly without waiting for server uploads or downloads.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Completely Free</h3>
                <p className="text-sm text-gray-700">
                  No account required, no hidden fees, no limits. Use it as much as you want.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 sm:p-12 text-center text-white shadow-lg">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start merging or converting your files right now. No sign-up required, no hassle.
            </p>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                if (window.navigateToPage) {
                  window.navigateToPage('home')
                } else {
                  window.location.hash = 'home'
                }
              }}
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
            >
              Start Using PDF Stitch
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default HowItWorks

