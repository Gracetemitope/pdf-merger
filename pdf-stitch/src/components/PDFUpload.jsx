import { useState, useRef } from 'react'
import { mergePDFs, downloadPDF, convertToPDF } from '../utils/pdfUtils'
import { PDFDocument } from 'pdf-lib'

function PDFUpload() {
  const [activeTab, setActiveTab] = useState('merge')
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [info, setInfo] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mergeProgress, setMergeProgress] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false)
  const [mergedPdfData, setMergedPdfData] = useState(null)
  const [mergedFilename, setMergedFilename] = useState('')
  const [convertingFileIndex, setConvertingFileIndex] = useState(0)
  const [totalConvertibleFiles, setTotalConvertibleFiles] = useState(0)
  const [convertedFiles, setConvertedFiles] = useState([])
  const [lastOperation, setLastOperation] = useState('merge') // Track last operation for download prompt
  const fileInputRef = useRef(null)

  // Supported file types
  const supportedTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpeg', '.jpg'],
  }

  const supportedExtensions = ['.pdf', '.doc', '.docx', '.jpeg', '.jpg']

  // Validate file type
  const isValidFileType = (file) => {
    const extension = '.' + file.name.split('.').pop().toLowerCase()
    return supportedExtensions.includes(extension)
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Handle file selection
  const handleFiles = (selectedFiles) => {
    setError('')
    const validFiles = []
    const invalidFiles = []

    Array.from(selectedFiles).forEach((file) => {
      if (isValidFileType(file)) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file.name)
      }
    })

    if (invalidFiles.length > 0) {
      setError(
        `Unsupported file type(s): ${invalidFiles.join(', ')}. Please upload PDF, DOC, DOCX, or JPEG files only.`
      )
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles])
    }
  }

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles)
    }
  }

  // Handle file input change
  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files
    if (selectedFiles.length > 0) {
      handleFiles(selectedFiles)
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle browse button click
  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  // Remove individual file
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setError('')
    setWarning('')
  }

  // Clear all files
  const clearAllFiles = () => {
    setFiles([])
    setError('')
    setWarning('')
  }

  // Get PDF files from uploaded files
  const getPdfFiles = () => {
    return files.filter(
      (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    )
  }

  // Get non-PDF files
  const getNonPdfFiles = () => {
    return files.filter(
      (file) => file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')
    )
  }

  // Handle merge confirmation
  const handleConfirmMerge = async () => {
    setShowConfirmDialog(false)
    setError('')
    setWarning('')
    setInfo('')
    setIsProcessing(true)
    setMergeProgress(0)

    const pdfFiles = getPdfFiles()

    try {
      // Simulate progress updates during merge
      const progressInterval = setInterval(() => {
        setMergeProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Merge PDFs
      const mergedPdfBytes = await mergePDFs(pdfFiles)

      clearInterval(progressInterval)
      setMergeProgress(100)

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      const filename = `merged-${timestamp}.pdf`

      // Store merged PDF data for download prompt
      setMergedPdfData(mergedPdfBytes)
      setMergedFilename(filename)

      // Show download prompt
      setShowDownloadPrompt(true)

      // Clear files after successful merge
      setFiles([])
    } catch (err) {
      const errorMessage = err.message || 'Failed to merge PDFs. Please try again.'
      setError(errorMessage)
      console.error('Merge error:', err)
    } finally {
      setIsProcessing(false)
      setMergeProgress(0)
    }
  }

  // Handle download
  const handleDownload = () => {
    if (mergedPdfData) {
      downloadPDF(mergedPdfData, mergedFilename)
      setShowDownloadPrompt(false)
      setMergedPdfData(null)
      setMergedFilename('')
      setInfo('PDF downloaded successfully!')
      setTimeout(() => setInfo(''), 3000)
    }
  }

  // Get convertible files (DOC, DOCX, JPEG, JPG)
  const getConvertibleFiles = () => {
    return files.filter((file) => {
      const fileName = file.name.toLowerCase()
      return (
        fileName.endsWith('.doc') ||
        fileName.endsWith('.docx') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.jpg') ||
        file.type === 'image/jpeg' ||
        file.type === 'application/msword' ||
        file.type.includes('wordprocessingml')
      )
    })
  }

  // Handle conversion
  const handleConvert = async () => {
    const convertibleFiles = getConvertibleFiles()

    if (convertibleFiles.length === 0) {
      setError('Please upload at least one file to convert (DOC, DOCX, JPEG, or JPG).')
      return
    }

    setIsProcessing(true)
    setError('')
    setWarning('')
    setInfo('')
    setMergeProgress(0)
    setConvertedFiles([])
    setConvertingFileIndex(0)
    setTotalConvertibleFiles(convertibleFiles.length)

    try {
      const convertedPdfs = []

      // Convert each file
      for (let i = 0; i < convertibleFiles.length; i++) {
        setConvertingFileIndex(i + 1)
        setMergeProgress(Math.round((i / convertibleFiles.length) * 80))

        try {
          const pdfBytes = await convertToPDF(convertibleFiles[i])
          convertedPdfs.push({
            bytes: pdfBytes,
            originalName: convertibleFiles[i].name,
          })
        } catch (err) {
          // Continue with other files even if one fails
          setWarning(
            (prev) =>
              prev +
              (prev ? '\n' : '') +
              `Failed to convert "${convertibleFiles[i].name}": ${err.message}`
          )
        }
      }

      if (convertedPdfs.length === 0) {
        setError('No files were successfully converted.')
        setIsProcessing(false)
        setMergeProgress(0)
        return
      }

      setMergeProgress(90)

      // If multiple files converted, merge them into one PDF
      if (convertedPdfs.length === 1) {
        // Single file - download directly
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
        const filename = convertedPdfs[0].originalName.replace(
          /\.[^/.]+$/,
          `-converted-${timestamp}.pdf`
        )
        setMergedPdfData(convertedPdfs[0].bytes)
        setMergedFilename(filename)
      } else {
        // Multiple files - merge them
        setMergeProgress(95)
        const mergedPdf = await PDFDocument.create()

        for (const converted of convertedPdfs) {
          const pdfDoc = await PDFDocument.load(converted.bytes)
          const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
          pages.forEach((page) => {
            mergedPdf.addPage(page)
          })
        }

        const mergedBytes = await mergedPdf.save()
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
        const filename = `converted-${timestamp}.pdf`
        setMergedPdfData(mergedBytes)
        setMergedFilename(filename)
      }

      setMergeProgress(100)
      setLastOperation('convert')
      setShowDownloadPrompt(true)
      
      setFiles([])
    } catch (err) {
      const errorMessage = err.message || 'Failed to convert files. Please try again.'
      setError(errorMessage)
      console.error('Conversion error:', err)
    } finally {
      setIsProcessing(false)
      setMergeProgress(0)
      setConvertingFileIndex(0)
    }
  }

  // Handle action button click
  const handleAction = () => {
    if (files.length === 0) {
      setError('Please upload at least one file.')
      return
    }

    if (activeTab === 'merge') {
      const pdfFiles = getPdfFiles()
      const nonPdfFiles = getNonPdfFiles()

      if (pdfFiles.length === 0) {
        setError('Please upload at least one PDF file to merge.')
        return
      }

      if (pdfFiles.length < 2) {
        setError('Please upload at least 2 PDF files to merge. You currently have only 1 PDF file.')
        return
      }

      // Show warning if there are non-PDF files
      if (nonPdfFiles.length > 0) {
        setWarning(
          `Warning: ${nonPdfFiles.length} non-PDF file(s) (${nonPdfFiles.map((f) => f.name).join(', ')}) will be excluded from merging. Only PDF files can be merged.`
        )
      } else {
        setWarning('')
      }

      // Show confirmation dialog with PDF count
      setShowConfirmDialog(true)
    } else {
      // Convert to PDF
      handleConvert()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 relative">
      {/* Tabs */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6">
        <button
          onClick={() => {
            setActiveTab('merge')
            setError('')
            setWarning('')
          }}
          className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'merge'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105 active:scale-95'
          }`}
        >
          Merge PDF
        </button>
        <button
          onClick={() => {
            setActiveTab('convert')
            setError('')
            setWarning('')
          }}
          className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'convert'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105 active:scale-95'
          }`}
        >
          Convert to PDF
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Warning Message */}
      {warning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-yellow-800">{warning}</p>
          </div>
        </div>
      )}

      {/* Info Message */}
      {info && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-green-800">{info}</p>
          </div>
        </div>
      )}

      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`border-2 border-dashed rounded-lg p-8 sm:p-12 mb-6 cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg shadow-blue-200 animate-pulse-glow'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 hover:scale-[1.01] hover:shadow-md active:scale-[0.99]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpeg,.jpg"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">
            Drag & drop files here
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 text-center">
            or click to browse. We support PDF, DOC, DOCX, and JPEG files.
          </p>
          <button
            type="button"
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation()
              handleBrowseClick()
            }}
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700">
              {files.length} file{files.length !== 1 ? 's' : ''} uploaded
            </h4>
            <button
              onClick={clearAllFiles}
              className="text-sm text-red-600 hover:text-red-700 hover:underline font-medium transition-all duration-200 active:scale-95"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 animate-bounce-in hover:bg-gray-100 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-3 text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-all duration-200 active:scale-90 flex-shrink-0"
                  aria-label="Remove file"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Indicator with Progress Bar */}
      {isProcessing && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-bounce-in">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-sm text-blue-700 font-medium flex-1">
              {activeTab === 'merge'
                ? 'Merging PDFs...'
                : convertingFileIndex > 0 && totalConvertibleFiles > 0
                  ? `Converting file ${convertingFileIndex} of ${totalConvertibleFiles}...`
                  : 'Converting files...'}
            </p>
            <span className="text-sm text-blue-600 font-semibold">{mergeProgress}%</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${mergeProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-bounce-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-bounce-in">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Merge</h3>
            <p className="text-sm text-gray-700 mb-2">
              You are about to merge <strong>{getPdfFiles().length}</strong> PDF file
              {getPdfFiles().length !== 1 ? 's' : ''}.
            </p>
            {getNonPdfFiles().length > 0 && (
              <p className="text-sm text-yellow-700 mb-4">
                Note: {getNonPdfFiles().length} non-PDF file(s) will be excluded.
              </p>
            )}
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowConfirmDialog(false)
                  setWarning('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMerge}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Merge PDFs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Prompt */}
      {showDownloadPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-bounce-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-bounce-in">
            <div className="flex items-center gap-3 mb-4">
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
              <h3 className="text-lg font-bold text-gray-900">
                {lastOperation === 'merge' ? 'Merge Complete!' : 'Conversion Complete!'}
              </h3>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              {lastOperation === 'merge'
                ? 'Your PDF files have been successfully merged. Click the button below to download the merged file.'
                : 'Your files have been successfully converted to PDF. Click the button below to download the converted file.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDownloadPrompt(false)
                  setMergedPdfData(null)
                  setMergedFilename('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {lastOperation === 'merge' ? 'Download Merged PDF' : 'Download Converted PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAction}
          disabled={files.length === 0 || isProcessing}
          className={`w-full sm:w-auto px-6 sm:px-8 py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
            files.length === 0 || isProcessing
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95'
          }`}
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            activeTab === 'merge' ? 'Merge Now' : 'Convert Now'
          )}
        </button>
      </div>
    </div>
  )
}

export default PDFUpload
