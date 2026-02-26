import { useState, useEffect, useRef } from 'react';
import { Footer } from '@common/components/footer';
import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { PageBanner } from '@common/components/page_banner';
import { Download, ChevronLeft, ChevronRight, BookOpen, FileText, Loader, ZoomIn, ZoomOut } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configuración del worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export function BookPage() {
  const pdfUrl = '/archive/peruanista.pe-hacer-que-el-peru-funcione.pdf';
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [viewMode, setViewMode] = useState<'book' | 'single'>('book');
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ajustar ancho del contenedor para responsive
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Navegación
  const goToPrevPage = () => {
    if (viewMode === 'book') {
      // Si estamos en la pág 2 (viendo 2-3), volver a 1. Si estamos en 1, nada.
      setPageNumber(prev => (prev === 2 ? 1 : Math.max(1, prev - 2)));
    } else {
      setPageNumber(prev => Math.max(1, prev - 1));
    }
  };

  const goToNextPage = () => {
    if (!numPages) return;
    if (viewMode === 'book') {
      // Si estamos en 1, ir a 2 (ver 2-3). Si estamos en 2, ir a 4 (ver 4-5).
      setPageNumber(prev => (prev === 1 ? 2 : Math.min(prev + 2, numPages)));
    } else {
      setPageNumber(prev => Math.min(prev + 1, numPages));
    }
  };

  // Sincronizar página al cambiar de modo (para que no quede en página par sola en modo libro)
  useEffect(() => {
    if (viewMode === 'book' && pageNumber > 1 && pageNumber % 2 !== 0) {
      setPageNumber(prev => prev - 1);
    }
  }, [viewMode, pageNumber]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

  const isFirstPage = pageNumber === 1;
  const isLastPage = numPages ? (viewMode === 'book' ? pageNumber >= numPages - 1 : pageNumber === numPages) : false;
  
  // Cálculo del ancho de página
  // En modo libro restamos un poco de espacio para el gap y dividimos entre 2
  const pageWidth = viewMode === 'book' && pageNumber !== 1 
    ? (containerWidth * 0.9) / 2 
    : Math.min(containerWidth * 0.9, 600); // Máximo ancho en modo single

  return (
    <Layout>
      <Header />
      <PageBanner
        title="Libro Peruanista"
        description="Accede gratuitamente al libro visitando la página."
        variant="project"
      />
      
      <main className="flex-1 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Barra de Herramientas */}
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Peruanista: Hacer que el Perú funcione</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Página {pageNumber} {viewMode === 'book' && pageNumber > 1 && numPages && pageNumber + 1 <= numPages ? `- ${pageNumber + 1}` : ''} de {numPages || '--'}
                </p>
              </div>

              {/* Controles de Vista */}
              <div className="flex items-center gap-3">
                {/* Zoom Controls */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow transition-all"
                    title="Reducir zoom"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <span className="w-12 text-center text-sm font-medium text-gray-700 select-none">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow transition-all"
                    title="Aumentar zoom"
                  >
                    <ZoomIn size={18} />
                  </button>
                </div>

                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('book')}
                  className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
                    viewMode === 'book' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Vista Libro"
                >
                  <BookOpen size={18} />
                  <span className="hidden sm:inline">Libro</span>
                </button>
                <button
                  onClick={() => setViewMode('single')}
                  className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
                    viewMode === 'single' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Vista Individual"
                >
                  <FileText size={18} />
                  <span className="hidden sm:inline">Individual</span>
                </button>
              </div>
              </div>

              <a 
                href={pdfUrl} 
                download
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:opacity-90 focus:outline-none transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </a>
            </div>
            
            {/* Visor PDF */}
            <div className="w-full bg-gray-200 p-4 sm:p-8 relative min-h-[600px] overflow-auto flex flex-col items-center" ref={containerRef}>
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex flex-col items-center text-gray-500">
                    <Loader className="animate-spin mb-2" />
                    <p>Cargando libro...</p>
                  </div>
                }
                error={<div className="text-red-500">Error al cargar el PDF.</div>}
              >
                <div className="flex justify-center items-center shadow-2xl">
                  {/* Página Izquierda (o única) */}
                  <div className="bg-white">
                    <Page 
                      pageNumber={pageNumber} 
                      width={pageWidth * scale}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-sm"
                    />
                  </div>

                  {/* Página Derecha (solo en modo libro y si no es la portada) */}
                  {viewMode === 'book' && pageNumber > 1 && numPages && pageNumber + 1 <= numPages && (
                    <div className="bg-white border-l border-gray-100">
                      <Page 
                        pageNumber={pageNumber + 1} 
                        width={pageWidth * scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </Document>

              {/* Botones de Navegación Flotantes */}
              {numPages && (
                <>
                  <button 
                    onClick={goToPrevPage} 
                    disabled={isFirstPage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={goToNextPage} 
                    disabled={isLastPage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </Layout>
  );
}
