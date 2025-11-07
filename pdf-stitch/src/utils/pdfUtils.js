import { PDFDocument } from 'pdf-lib'
import jsPDF from 'jspdf'
import mammoth from 'mammoth'
import html2canvas from 'html2canvas'

/**
 * Merges multiple PDF files into a single PDF
 * @param {File[]} files - Array of PDF File objects
 * @returns {Promise<Uint8Array>} - Merged PDF as Uint8Array
 */
export async function mergePDFs(files) {
  if (!files || files.length === 0) {
    throw new Error('No files provided for merging')
  }

  // Create a new PDF document
  const mergedPdf = await PDFDocument.create()

  // Process each PDF file
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error(`File "${file.name}" is not a PDF file`)
    }

    try {
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer()
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      // Get all pages from the PDF
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
      
      // Add each page to the merged PDF
      pages.forEach((page) => {
        mergedPdf.addPage(page)
      })
    } catch (error) {
      throw new Error(`Failed to process "${file.name}": ${error.message}`)
    }
  }

  // Generate the merged PDF as bytes
  const pdfBytes = await mergedPdf.save()
  return pdfBytes
}

/**
 * Downloads a PDF file
 * @param {Uint8Array} pdfBytes - PDF file as Uint8Array
 * @param {string} filename - Name for the downloaded file
 */
export function downloadPDF(pdfBytes, filename = 'merged.pdf') {
  // Create a blob from the PDF bytes
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob)
  
  // Create a temporary anchor element and trigger download
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  
  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Converts a single file to PDF
 * @param {File} file - File to convert (DOC, DOCX, JPEG, JPG)
 * @returns {Promise<Uint8Array>} - Converted PDF as Uint8Array
 */
export async function convertToPDF(file) {
  if (!file) {
    throw new Error('No file provided for conversion')
  }

  const fileName = file.name.toLowerCase()
  const fileType = file.type

  // Convert JPEG/JPG images to PDF
  if (
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.jpg') ||
    fileType === 'image/jpeg'
  ) {
    return await convertImageToPDF(file)
  }

  // Convert DOCX to PDF
  if (fileName.endsWith('.docx') || fileType.includes('wordprocessingml')) {
    return await convertDocxToPDF(file)
  }

  // Convert DOC (old format) - limited browser support
  if (fileName.endsWith('.doc') || fileType === 'application/msword') {
    throw new Error(
      'DOC files (older Word format) are not supported for browser-based conversion. Please convert to DOCX format first or use a desktop application.'
    )
  }

  throw new Error(`Unsupported file type: ${file.name}`)
}

/**
 * Converts an image (JPEG/JPG) to PDF
 * @param {File} file - Image file
 * @returns {Promise<Uint8Array>} - PDF as Uint8Array
 */
async function convertImageToPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const img = new Image()
        img.onload = () => {
          // Create PDF with image dimensions
          const pdf = new jsPDF({
            orientation: img.width > img.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [img.width, img.height],
          })

          // Add image to PDF (full page)
          pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height)

          // Convert to Uint8Array
          const pdfBlob = pdf.output('arraybuffer')
          resolve(new Uint8Array(pdfBlob))
        }

        img.onerror = () => {
          reject(new Error('Failed to load image'))
        }

        img.src = e.target.result
      } catch (error) {
        reject(new Error(`Failed to convert image: ${error.message}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read image file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Converts DOCX to PDF
 * @param {File} file - DOCX file
 * @returns {Promise<Uint8Array>} - PDF as Uint8Array
 */
async function convertDocxToPDF(file) {
  let tempDiv = null
  let styleElement = null

  try {
    // Step 1: Convert DOCX to HTML using mammoth with enhanced style mapping
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({ 
      arrayBuffer,
      styleMap: [
        // Preserve headings
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Heading 5'] => h5:fresh",
        "p[style-name='Heading 6'] => h6:fresh",
        // Preserve list paragraphs
        "p[style-name='List Paragraph'] => p:fresh",
        // Preserve normal paragraphs
        "p[style-name='Normal'] => p:fresh",
        // Preserve title
        "p[style-name='Title'] => h1.title:fresh",
        // Preserve subtitles
        "p[style-name='Subtitle'] => p.subtitle:fresh",
      ]
    })

    // Only log errors, not warnings
    const errors = result.messages.filter(msg => msg.type === 'error')
    if (errors.length > 0) {
      console.error('DOCX conversion errors:', errors)
    }

    // Check if HTML content is empty
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('DOCX file appears to be empty or could not be converted to HTML')
    }

    // Step 2: Insert HTML into a hidden element in the DOM with custom CSS
    tempDiv = document.createElement('div')
    tempDiv.className = 'docx-converter-container'
    tempDiv.innerHTML = result.value
    
    // Inject custom CSS for better styling preservation (scoped to container)
    styleElement = document.createElement('style')
    styleElement.textContent = `
      /* Base styles - scoped to converter container */
      .docx-converter-container {
        display: block;
        box-sizing: border-box;
        font-family: 'Times New Roman', Times, serif;
        font-size: 14pt;
        line-height: 1.6;
        color: #000000 !important;
        margin: 0;
        padding: 0;
        width: 170mm; /* A4 width (210mm) minus margins (20mm each side) */
        max-width: 170mm;
        min-height: 1px;
      }
      
      /* Ensure all text elements are visible */
      .docx-converter-container * {
        color: inherit;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* Headings - larger, readable sizes */
      .docx-converter-container h1 {
        font-size: 28pt;
        font-weight: bold;
        margin-top: 16pt;
        margin-bottom: 10pt;
        line-height: 1.3;
      }
      .docx-converter-container h2 {
        font-size: 24pt;
        font-weight: bold;
        margin-top: 14pt;
        margin-bottom: 8pt;
        line-height: 1.3;
      }
      .docx-converter-container h3 {
        font-size: 20pt;
        font-weight: bold;
        margin-top: 12pt;
        margin-bottom: 6pt;
        line-height: 1.4;
      }
      .docx-converter-container h4 {
        font-size: 18pt;
        font-weight: bold;
        margin-top: 10pt;
        margin-bottom: 6pt;
        line-height: 1.4;
      }
      .docx-converter-container h5 {
        font-size: 16pt;
        font-weight: bold;
        margin-top: 8pt;
        margin-bottom: 4pt;
        line-height: 1.5;
      }
      .docx-converter-container h6 {
        font-size: 14pt;
        font-weight: bold;
        margin-top: 6pt;
        margin-bottom: 4pt;
        line-height: 1.5;
      }
      
      /* Paragraphs - larger, readable font size */
      .docx-converter-container p {
        font-size: 14pt;
        line-height: 1.6;
        margin-top: 0;
        margin-bottom: 8pt;
        text-align: left;
      }
      
      /* Preserve bold and italic */
      .docx-converter-container strong,
      .docx-converter-container b {
        font-weight: bold;
      }
      .docx-converter-container em,
      .docx-converter-container i {
        font-style: italic;
      }
      .docx-converter-container u {
        text-decoration: underline;
      }
      
      /* Lists */
      .docx-converter-container ul,
      .docx-converter-container ol {
        margin-top: 8pt;
        margin-bottom: 8pt;
        padding-left: 40pt;
      }
      .docx-converter-container li {
        margin-bottom: 4pt;
        line-height: 1.6;
        font-size: 14pt;
      }
      
      /* Title and subtitle */
      .docx-converter-container .title {
        font-size: 32pt;
        font-weight: bold;
        text-align: center;
        margin-top: 16pt;
        margin-bottom: 16pt;
      }
      .docx-converter-container .subtitle {
        font-size: 16pt;
        font-style: italic;
        text-align: center;
        margin-bottom: 16pt;
      }
      
      /* Tables */
      .docx-converter-container table {
        border-collapse: collapse;
        width: 100%;
        margin-top: 8pt;
        margin-bottom: 8pt;
        font-size: 14pt;
      }
      .docx-converter-container td,
      .docx-converter-container th {
        border: 1px solid #000000;
        padding: 6pt;
        text-align: left;
      }
      .docx-converter-container th {
        font-weight: bold;
        background-color: #f0f0f0;
      }
      
      /* Preserve text alignment */
      .docx-converter-container p[style*="text-align: center"] {
        text-align: center;
      }
      .docx-converter-container p[style*="text-align: right"] {
        text-align: right;
      }
      .docx-converter-container p[style*="text-align: justify"] {
        text-align: justify;
      }
      
      /* Preserve font sizes from inline styles */
      .docx-converter-container span[style*="font-size"] {
        /* Preserve original font-size */
      }
      .docx-converter-container span[style*="font-weight: bold"] {
        font-weight: bold;
      }
      .docx-converter-container span[style*="font-style: italic"] {
        font-style: italic;
      }
    `
    
    // Style the container - position in viewport but make it visually hidden
    // Container width should match PDF content width (170mm = A4 210mm - 40mm margins)
    // Convert 170mm to pixels: 170mm * 3.7795 px/mm ≈ 643px
    const containerWidthPx = 643 // 170mm in pixels at 96 DPI
    
    tempDiv.style.position = 'fixed'
    tempDiv.style.left = '0'
    tempDiv.style.top = '0'
    tempDiv.style.width = `${containerWidthPx}px`
    tempDiv.style.maxWidth = `${containerWidthPx}px`
    tempDiv.style.padding = '20px'
    tempDiv.style.margin = '0'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.color = 'black'
    tempDiv.style.fontFamily = "'Times New Roman', Times, serif"
    tempDiv.style.fontSize = '14pt'
    tempDiv.style.lineHeight = '1.6'
    tempDiv.style.visibility = 'visible'
    tempDiv.style.opacity = '1' // Fully opaque for html2canvas
    tempDiv.style.zIndex = '999999' // High z-index but we'll hide it
    tempDiv.style.pointerEvents = 'none'
    tempDiv.style.overflow = 'visible'
    // Use transform to move it off-screen but keep it in viewport for html2canvas
    tempDiv.style.transform = 'translateX(-10000px)'
    tempDiv.setAttribute('aria-hidden', 'true')
    
    // Append style and div to body
    document.head.appendChild(styleElement)
    document.body.appendChild(tempDiv)

    // Wait for rendering and images to load
    await new Promise((resolve) => {
      const images = tempDiv.querySelectorAll('img')
      if (images.length === 0) {
        setTimeout(resolve, 500)
      } else {
        let loadedCount = 0
        const checkComplete = () => {
          if (loadedCount === images.length) {
            setTimeout(resolve, 300)
          }
        }
        images.forEach((img) => {
          if (img.complete) {
            loadedCount++
            checkComplete()
          } else {
            img.onload = () => {
              loadedCount++
              checkComplete()
            }
            img.onerror = () => {
              loadedCount++
              checkComplete()
            }
          }
        })
        checkComplete()
      }
    })

    // Verify the div has content
    if (!tempDiv.textContent || tempDiv.textContent.trim().length === 0) {
      throw new Error('HTML content is empty after conversion')
    }

    // Step 3: Use html2canvas to convert HTML to canvas
    // Helper function to capture canvas with retry
    const captureCanvas = async (retryCount = 0) => {
      // Make sure element is fully rendered and visible for html2canvas
      await new Promise(resolve => setTimeout(resolve, 300 + (retryCount * 100)))
      
      // Temporarily make element fully visible for html2canvas
      const originalTransform = tempDiv.style.transform
      const originalZIndex = tempDiv.style.zIndex
      const originalOpacity = tempDiv.style.opacity
      const originalVisibility = tempDiv.style.visibility
      
      // Make element visible and in viewport for html2canvas
      tempDiv.style.transform = 'translateX(0) translateY(0)'
      tempDiv.style.zIndex = '999999'
      tempDiv.style.opacity = '1'
      tempDiv.style.visibility = 'visible'
      tempDiv.style.display = 'block'
      
      // Force a reflow to ensure rendering
      void tempDiv.offsetHeight
      void tempDiv.scrollHeight
      
      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 200 + (retryCount * 100)))
      
      // Verify element has dimensions
      const elementWidth = tempDiv.scrollWidth || tempDiv.offsetWidth || containerWidthPx
      const elementHeight = tempDiv.scrollHeight || tempDiv.offsetHeight
      
      if (elementWidth === 0 || elementHeight === 0) {
        // Restore styles before throwing
        tempDiv.style.transform = originalTransform
        tempDiv.style.zIndex = originalZIndex
        tempDiv.style.opacity = originalOpacity
        tempDiv.style.visibility = originalVisibility
        throw new Error('HTML element has no dimensions - cannot capture')
      }
      
      // Try different html2canvas configurations
      const configs = [
        {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
          width: elementWidth,
          height: elementHeight,
          windowWidth: elementWidth + 40,
          windowHeight: elementHeight + 40,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
        },
        {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
        },
        {
          scale: 1,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
        }
      ]
      
      const config = configs[Math.min(retryCount, configs.length - 1)]
      
      const canvas = await html2canvas(tempDiv, {
        ...config,
        ignoreElements: (element) => {
          // Don't ignore anything - we want to capture everything
          return false
        },
        onclone: (clonedDoc) => {
          // Ensure cloned element is also visible and properly styled
          const clonedElement = clonedDoc.querySelector('.docx-converter-container')
          if (clonedElement) {
            clonedElement.style.transform = 'none'
            clonedElement.style.opacity = '1'
            clonedElement.style.visibility = 'visible'
            clonedElement.style.display = 'block'
            clonedElement.style.position = 'static'
            // Force all child elements to be visible
            const allElements = clonedElement.querySelectorAll('*')
            allElements.forEach(el => {
              el.style.visibility = 'visible'
              el.style.opacity = '1'
            })
          }
        }
      })
      
      // Restore original styles to hide element again
      tempDiv.style.transform = originalTransform
      tempDiv.style.zIndex = originalZIndex
      tempDiv.style.opacity = originalOpacity
      tempDiv.style.visibility = originalVisibility
      
      return canvas
    }
    
    // Try capturing with retries
    let canvas = null
    let lastError = null
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        canvas = await captureCanvas(attempt)
        break
      } catch (error) {
        lastError = error
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 300))
        }
      }
    }
    
    if (!canvas) {
      throw new Error(`Failed to capture canvas after multiple attempts: ${lastError?.message || 'Unknown error'}`)
    }

    // Verify canvas has content
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Failed to capture HTML content as canvas - canvas is empty')
    }

    // Check if canvas actually has non-white content
    // Use a more lenient approach - sample the entire canvas in chunks
    const ctx = canvas.getContext('2d')
    const chunkSize = 100 // Sample in 100x100 chunks
    const chunksX = Math.ceil(canvas.width / chunkSize)
    const chunksY = Math.ceil(canvas.height / chunkSize)
    
    let hasContent = false
    let totalPixelsChecked = 0
    let nonWhitePixels = 0
    
    // Sample chunks across the canvas
    for (let cy = 0; cy < chunksY && !hasContent; cy++) {
      for (let cx = 0; cx < chunksX && !hasContent; cx++) {
        const x = cx * chunkSize
        const y = cy * chunkSize
        const width = Math.min(chunkSize, canvas.width - x)
        const height = Math.min(chunkSize, canvas.height - y)
        
        if (width > 0 && height > 0) {
          const imageData = ctx.getImageData(x, y, width, height)
          const pixelCount = imageData.data.length / 4
          totalPixelsChecked += pixelCount
          
          // Count non-white pixels (RGB values less than 250)
          for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i]
            const g = imageData.data[i + 1]
            const b = imageData.data[i + 2]
            // Consider it non-white if any channel is significantly less than 255
            if (r < 250 || g < 250 || b < 250) {
              nonWhitePixels++
              hasContent = true
              break
            }
          }
        }
      }
    }
    
    // If we haven't found content yet, do a more thorough check
    // Sample every 10th pixel across the entire canvas
    if (!hasContent && canvas.width > 0 && canvas.height > 0) {
      const step = 10
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const imageData = ctx.getImageData(x, y, 1, 1)
          const r = imageData.data[0]
          const g = imageData.data[1]
          const b = imageData.data[2]
          if (r < 250 || g < 250 || b < 250) {
            hasContent = true
            break
          }
        }
        if (hasContent) break
      }
    }

    if (!hasContent) {
      // Log some debug info before throwing
      console.warn('Canvas content check failed:', {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        totalPixelsChecked,
        nonWhitePixels,
        elementTextLength: tempDiv.textContent?.length || 0,
        elementHTML: tempDiv.innerHTML.substring(0, 200)
      })
      throw new Error('Canvas appears to be empty or only contains white pixels. The HTML content may not be rendering correctly. Please try a different DOCX file or check if the file has visible content.')
    }

    // Step 4: Use jsPDF to add canvas to PDF with proper page handling
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    })

    // A4 dimensions: 210mm x 297mm
    // Margins: 20mm on each side
    // Content area: 170mm x 257mm
    
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    
    // Convert pixels to mm (at scale 2, 1px = 0.264583mm / 2 = 0.132292mm at 96 DPI)
    // Actually, with scale 2, the canvas is 2x larger, so we need to divide by 2
    const imgWidthMm = (imgWidth / 2) * 0.264583
    const imgHeightMm = (imgHeight / 2) * 0.264583
    
    // Content area dimensions
    const contentWidthMm = 170
    const contentHeightMm = 257
    
    // Calculate how many pages we need
    const pagesNeeded = Math.ceil(imgHeightMm / contentHeightMm)
    
    // Add image to PDF, splitting across pages if needed
    let pagesAdded = 0
    for (let i = 0; i < pagesNeeded; i++) {
      // Calculate source coordinates (accounting for scale)
      const sourceY = (i * contentHeightMm) / 0.264583 * 2 // Multiply by 2 for scale
      const sourceHeightPx = Math.min(
        (contentHeightMm / 0.264583) * 2, // Convert to pixels and account for scale
        imgHeight - sourceY
      )
      
      // Only create page if there's content
      if (sourceHeightPx <= 0 || sourceY >= imgHeight) {
        break
      }
      
      // Create a temporary canvas for this page
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = imgWidth
      pageCanvas.height = Math.ceil(sourceHeightPx)
      const pageCtx = pageCanvas.getContext('2d')
      
      // Fill with white background
      pageCtx.fillStyle = '#ffffff'
      pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
      
      // Draw the portion of the original canvas
      pageCtx.drawImage(
        canvas,
        0,
        sourceY,
        imgWidth,
        sourceHeightPx,
        0,
        0,
        imgWidth,
        sourceHeightPx
      )
      
      // Check if this page canvas has content (not just white)
      // Sample multiple areas to ensure we catch content
      const sampleWidth = Math.min(200, pageCanvas.width)
      const sampleHeight = Math.min(200, pageCanvas.height)
      const pageImageData = pageCtx.getImageData(0, 0, sampleWidth, sampleHeight)
      let pageHasContent = Array.from(pageImageData.data).some((val, idx) => {
        if (idx % 4 === 3) return false // Skip alpha
        return val < 250
      })
      
      // If no content in first sample, check middle and bottom
      if (!pageHasContent && pageCanvas.height > 200) {
        const midImageData = pageCtx.getImageData(0, Math.floor(pageCanvas.height / 2), sampleWidth, sampleHeight)
        pageHasContent = Array.from(midImageData.data).some((val, idx) => {
          if (idx % 4 === 3) return false
          return val < 250
        })
      }
      if (!pageHasContent && pageCanvas.height > 400) {
        const bottomImageData = pageCtx.getImageData(0, pageCanvas.height - sampleHeight, sampleWidth, sampleHeight)
        pageHasContent = Array.from(bottomImageData.data).some((val, idx) => {
          if (idx % 4 === 3) return false
          return val < 250
        })
      }
      
      // Only add page if it has content
      if (pageHasContent) {
        if (i > 0) {
          pdf.addPage()
        }
        
        const imgData = pageCanvas.toDataURL('image/png', 0.95)
        const pageHeightMm = Math.min(contentHeightMm, imgHeightMm - i * contentHeightMm)
        
        if (pageHeightMm > 5) {
          pdf.addImage(imgData, 'PNG', 20, 20, contentWidthMm, pageHeightMm)
          pagesAdded++
        }
      } else if (i === 0) {
        // If first page has no content, something is wrong
        throw new Error('First page of PDF has no content - conversion may have failed. Canvas may not have captured the HTML content properly.')
      } else {
        // If later pages have no content, just break (don't add empty pages)
        break
      }
    }
    
    // Ensure at least one page was added
    if (pagesAdded === 0) {
      throw new Error('No pages with content were added to PDF - the HTML content may not have been captured correctly')
    }

    // Verify PDF was created and has pages
    const totalPages = pdf.internal.getNumberOfPages()
    if (totalPages === 0) {
      throw new Error('PDF generation failed - no pages created')
    }

    // Get PDF as bytes
    const pdfBytes = pdf.output('arraybuffer')

    // Verify PDF bytes are not empty
    if (!pdfBytes || pdfBytes.byteLength === 0) {
      throw new Error('Generated PDF is empty')
    }

    // Clean up temporary DOM elements
    if (tempDiv && document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv)
    }
    if (styleElement && document.head.contains(styleElement)) {
      document.head.removeChild(styleElement)
    }

    return new Uint8Array(pdfBytes)
  } catch (error) {
    // Clean up on error
    if (tempDiv && document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv)
    }
    if (styleElement && document.head.contains(styleElement)) {
      document.head.removeChild(styleElement)
    }
    throw new Error(`Failed to convert DOCX: ${error.message}`)
  }
}

