function Header() {
  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
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
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="#1E40AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M14 2V8H20"
                stroke="#1E40AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 13H8"
                stroke="#1E40AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17H8"
                stroke="#1E40AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 9H9H8"
                stroke="#1E40AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">PDF Stitch</h1>
          </a>
          {/* Navigation Links */}
          <nav className="flex items-center gap-3 sm:gap-6">
            <a 
              href="#how-it-works" 
              onClick={(e) => {
                e.preventDefault()
                if (window.navigateToPage) {
                  window.navigateToPage('how-it-works')
                } else {
                  window.location.hash = 'how-it-works'
                }
              }}
              className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 hover:underline transition-all"
            >
              How it Works
            </a>
            <a href="#" className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 hover:underline transition-all">Privacy Policy</a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

