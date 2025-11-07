import Header from '../components/Header'
import Footer from '../components/Footer'

function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Header />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Privacy & Security
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
              Your privacy is our top priority. Learn how PDF Stitch protects your data and files.
            </p>
          </div>

          {/* Main Privacy Statement */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 sm:p-12 text-white shadow-lg mb-12">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  100% Client-Side Processing
                </h2>
                <p className="text-lg sm:text-xl opacity-90 leading-relaxed">
                  PDF Stitch processes all files entirely in your browser. We never upload, store, or access your files. Your data never leaves your device.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* No Uploads */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No File Uploads
                  </h3>
                  <p className="text-gray-700">
                    Your files are never uploaded to any server. All processing happens locally in your browser using JavaScript.
                  </p>
                </div>
              </div>
            </div>

            {/* No Storage */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Data Storage
                  </h3>
                  <p className="text-gray-700">
                    We don't store your files, personal information, or any usage data. Once you close the browser tab, everything is gone.
                  </p>
                </div>
              </div>
            </div>

            {/* No Account Required */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Account Required
                  </h3>
                  <p className="text-gray-700">
                    Use PDF Stitch without creating an account or providing any personal information. Just open the app and start using it.
                  </p>
                </div>
              </div>
            </div>

            {/* No Tracking */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Tracking
                  </h3>
                  <p className="text-gray-700">
                    We don't use cookies, analytics, or any tracking technologies. Your browsing activity remains completely private.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
              How We Protect Your Privacy
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-600">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Files Stay in Your Browser
                    </h3>
                    <p className="text-gray-700">
                      When you upload files to PDF Stitch, they are loaded directly into your browser's memory. They never leave your device or connect to any external server.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-600">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Processing Happens Locally
                    </h3>
                    <p className="text-gray-700">
                      All PDF merging and conversion operations are performed using JavaScript libraries that run entirely in your browser. No server-side processing is involved.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-600">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Automatic Cleanup
                    </h3>
                    <p className="text-gray-700">
                      Once you download your processed file or close the browser tab, all file data is automatically cleared from memory. Nothing persists on your device or our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Details */}
          <section className="mb-12">
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Technical Details
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  PDF Stitch is built using modern web technologies that enable client-side file processing:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>PDF Processing:</strong> Uses <code className="bg-gray-200 px-2 py-1 rounded">pdf-lib</code> library to merge PDF files entirely in your browser</li>
                  <li><strong>Document Conversion:</strong> Converts DOCX and JPEG files to PDF using <code className="bg-gray-200 px-2 py-1 rounded">mammoth</code>, <code className="bg-gray-200 px-2 py-1 rounded">jsPDF</code>, and <code className="bg-gray-200 px-2 py-1 rounded">html2canvas</code> libraries</li>
                  <li><strong>No Network Requests:</strong> All operations are performed offline once the page is loaded</li>
                  <li><strong>Open Source Libraries:</strong> We use well-established, open-source libraries that you can verify yourself</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Reassuring Note */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 sm:p-10 text-center">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-4">
              Your Files Are Safe
            </h2>
            <p className="text-lg sm:text-xl text-green-800 mb-6 max-w-2xl mx-auto">
              You can confidently use PDF Stitch to merge and convert your files. Whether you're working with sensitive documents, personal files, or confidential information, rest assured that your data never leaves your device.
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
              className="inline-block px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
            >
              Start Using PDF Stitch
            </a>
          </div>

          {/* Last Updated */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Privacy

