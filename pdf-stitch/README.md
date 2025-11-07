# PDF Stitch - Free & Secure PDF Merger & Converter

A modern, client-side web application for merging multiple PDF files and converting DOCX/JPEG files to PDF. All processing happens securely in your browser—no uploads, no storage, no tracking.

## 🚀 Features

- **PDF Merging**: Combine multiple PDF files into one seamless document
- **File Conversion**: Convert DOC, DOCX, JPEG, and JPG files to PDF format
- **100% Client-Side**: All processing happens in your browser—your files never leave your device
- **No Account Required**: Use the app immediately without signing up
- **Privacy-First**: No file uploads, no data storage, no tracking
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful, intuitive interface with smooth animations and hover effects

## 🛠️ Technologies Used

- **React 19.1.1** - UI framework
- **Vite 7.1.7** - Build tool and dev server
- **TailwindCSS 3.4.18** - Utility-first CSS framework
- **pdf-lib 1.17.1** - PDF manipulation library
- **jsPDF 3.0.3** - PDF generation from images
- **mammoth 1.11.0** - DOCX to HTML conversion
- **html2canvas 1.4.1** - HTML to canvas conversion

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v7 or higher) or **yarn**

## 🏗️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Gracetemitope/pdf-merger.git
cd pdf-merger/pdf-stitch
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- Vite and plugins
- TailwindCSS and PostCSS
- PDF processing libraries (pdf-lib, jsPDF, mammoth, html2canvas)

### Step 3: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## 📁 Project Structure

```
pdf-stitch/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Header.jsx      # Navigation header with logo and menu
│   │   ├── Footer.jsx      # Footer component
│   │   └── PDFUpload.jsx  # Main file upload and processing component
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Main landing page
│   │   ├── HowItWorks.jsx  # How It Works guide page
│   │   └── Privacy.jsx     # Privacy & Security page
│   ├── utils/              # Utility functions
│   │   └── pdfUtils.js     # PDF merge and conversion functions
│   ├── assets/             # Static assets
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── public/                 # Public static files
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # TailwindCSS configuration
├── postcss.config.js       # PostCSS configuration
├── vite.config.js          # Vite configuration
└── README.md              # This file
```

## 🎯 Development Process

### Step 1: Project Initialization

The project was initialized using Vite with React template:

```bash
npm create vite@latest pdf-stitch -- --template react
cd pdf-stitch
npm install
```

### Step 2: TailwindCSS Setup

1. **Install TailwindCSS and dependencies:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. **Configure TailwindCSS** (`tailwind.config.js`):
   - Added Inter font family
   - Added custom background color (`bg-light: '#F8F8F8'`)
   - Configured content paths for purging

3. **Add Tailwind directives** to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Add Google Fonts** to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### Step 3: Component Architecture

#### Header Component (`src/components/Header.jsx`)
- Logo with PDF icon
- Navigation links (How It Works, Privacy Policy)
- Responsive design with mobile-friendly text sizes
- Clickable logo that navigates to home

#### Footer Component (`src/components/Footer.jsx`)
- Simple footer with app information
- Centered text layout

#### PDFUpload Component (`src/components/PDFUpload.jsx`)
- **State Management:**
  - File upload state
  - Active tab (merge/convert)
  - Processing status and progress
  - Error, warning, and info messages
  - Dialog states (confirmation, download prompt)

- **Features:**
  - Drag-and-drop file upload
  - Click-to-browse file selection
  - File type validation (PDF, DOC, DOCX, JPEG, JPG)
  - File list display with remove functionality
  - Tab switching between merge and convert modes
  - Progress indicators during processing
  - Confirmation dialogs
  - Download prompts

- **Validation:**
  - Requires minimum 2 PDF files for merging
  - Validates file types before processing
  - Shows warnings for excluded files

### Step 4: PDF Processing Utilities

#### PDF Merge Function (`src/utils/pdfUtils.js`)

```javascript
async function mergePDFs(files) {
  const pdfDoc = await PDFDocument.create()
  
  for (const file of files) {
    const fileBytes = await file.arrayBuffer()
    const pdf = await PDFDocument.load(fileBytes)
    const pages = await pdfDoc.copyPages(pdf, pdf.getPageIndices())
    pages.forEach((page) => pdfDoc.addPage(page))
  }
  
  return await pdfDoc.save()
}
```

**Process:**
1. Create a new PDF document
2. Loop through each uploaded PDF file
3. Load each PDF file into memory
4. Copy all pages from each PDF
5. Add pages to the merged document
6. Return the merged PDF as Uint8Array

#### DOCX to PDF Conversion

**Process:**
1. Convert DOCX to HTML using `mammoth` library
2. Inject custom CSS for styling preservation
3. Create a hidden DOM element with the HTML
4. Use `html2canvas` to render HTML to canvas
5. Convert canvas to PDF using `jsPDF`
6. Handle multi-page documents by splitting across pages
7. Clean up temporary DOM elements

**Key Implementation Details:**
- Uses `mammoth.convertToHtml()` with custom style mapping
- Injects CSS scoped to `.docx-converter-container`
- Positions element off-screen but visible to html2canvas
- Validates canvas content before PDF generation
- Handles page splitting for long documents

#### JPEG to PDF Conversion

```javascript
async function convertImageToPDF(file) {
  const img = new Image()
  const objectUrl = URL.createObjectURL(file)
  
  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = objectUrl
  })
  
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: img.width > img.height ? 'landscape' : 'portrait',
  })
  
  const imgWidth = pdf.internal.pageSize.getWidth()
  const imgHeight = (img.height * imgWidth) / img.width
  
  pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight)
  URL.revokeObjectURL(objectUrl)
  
  return new Uint8Array(pdf.output('arraybuffer'))
}
```

### Step 5: Routing Implementation

Simple hash-based routing without external dependencies:

```javascript
// App.jsx
const [currentPage, setCurrentPage] = useState('home')

useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash.slice(1) || 'home'
    setCurrentPage(hash)
  }
  
  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
  return () => window.removeEventListener('hashchange', handleHashChange)
}, [])
```

**Pages:**
- `#home` - Main landing page with file upload
- `#how-it-works` - Step-by-step guide
- `#privacy` - Privacy and security information

### Step 6: UI Enhancements

#### Animations (`src/index.css`)
- `slide-in-right` - Toast notifications
- `pulse-glow` - Drag-and-drop area
- `bounce-in` - File list items and dialogs
- `shake` - Error states (available but not used)

#### Hover Effects
- Button scale transformations
- Shadow effects
- Color transitions
- Active state feedback

#### Responsive Design
- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`
- Flexible layouts with Tailwind grid and flexbox
- Touch-friendly button sizes

### Step 7: File Type Filtering

The file input uses the `accept` attribute to filter file explorer:

```html
<input
  type="file"
  multiple
  accept=".pdf,.doc,.docx,.jpeg,.jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg"
/>
```

This ensures users only see supported file types in the file picker.

## 🔧 Key Features Implementation

### Drag-and-Drop File Upload

```javascript
const handleDragEnter = (e) => {
  e.preventDefault()
  setIsDragging(true)
}

const handleDrop = (e) => {
  e.preventDefault()
  setIsDragging(false)
  const droppedFiles = e.dataTransfer.files
  if (droppedFiles.length > 0) {
    handleFiles(droppedFiles)
  }
}
```

### Progress Tracking

```javascript
// Simulate progress during merge
const progressInterval = setInterval(() => {
  setMergeProgress((prev) => {
    if (prev >= 90) {
      clearInterval(progressInterval)
      return prev
    }
    return prev + 10
  })
}, 200)
```

### Error Handling

- File type validation
- Minimum file count validation (2+ PDFs for merge)
- Try-catch blocks around async operations
- User-friendly error messages
- Console logging for debugging

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

- Hot Module Replacement (HMR) enabled
- Fast refresh for React components
- Development server on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory:
- Minified JavaScript
- Optimized CSS
- Tree-shaken dependencies
- Asset optimization

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally before deployment.

## 📦 Building & Deployment

### Build Process

1. **Run build command:**
```bash
npm run build
```

2. **Output:**
   - `dist/index.html` - Entry HTML file
   - `dist/assets/` - Optimized JS and CSS bundles
   - All assets are hashed for cache busting

### Deployment Options

#### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

#### Vercel
1. Import your GitHub repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy automatically

#### GitHub Pages
1. Install `gh-pages`: `npm install -D gh-pages`
2. Add to `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```
3. Run: `npm run deploy`

#### Static Hosting
Upload the contents of the `dist/` folder to any static hosting service:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Any web server

## 🧪 Testing

### Manual Testing Checklist

- [ ] Upload and merge multiple PDF files
- [ ] Convert DOCX files to PDF
- [ ] Convert JPEG files to PDF
- [ ] Drag-and-drop file upload
- [ ] File removal functionality
- [ ] Error handling for invalid files
- [ ] Minimum 2 PDF requirement for merge
- [ ] Progress indicators
- [ ] Download functionality
- [ ] Navigation between pages
- [ ] Mobile responsiveness
- [ ] Browser compatibility

### Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security & Privacy

### Client-Side Processing
- All file processing happens in the browser
- No server-side code required
- Files never leave the user's device

### No Data Collection
- No analytics tracking
- No cookies
- No user accounts
- No file storage

### Libraries Used
All libraries are open-source and can be audited:
- `pdf-lib` - PDF manipulation
- `jsPDF` - PDF generation
- `mammoth` - DOCX conversion
- `html2canvas` - HTML rendering

## 📝 Development Notes

### Common Issues & Solutions

1. **TailwindCSS styles not applying:**
   - Ensure `tailwind.config.js` has correct content paths
   - Check that `@tailwind` directives are in `index.css`
   - Restart dev server after config changes

2. **DOCX conversion produces empty PDF:**
   - Ensure HTML element is visible to html2canvas
   - Check that CSS is properly injected
   - Verify mammoth conversion produces valid HTML

3. **File upload not working:**
   - Check file input `accept` attribute
   - Verify file type validation logic
   - Check browser console for errors

### Performance Optimization

- Lazy loading for large files
- Progress indicators for user feedback
- Memory cleanup after processing
- Efficient PDF page copying
- Canvas optimization for large documents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [pdf-lib](https://github.com/Hopding/pdf-lib) - PDF manipulation library
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation library
- [mammoth](https://github.com/mwilliamson/mammoth.js) - DOCX to HTML conversion
- [html2canvas](https://github.com/niklasvh/html2canvas) - HTML to canvas rendering
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using React, Vite, and TailwindCSS**
