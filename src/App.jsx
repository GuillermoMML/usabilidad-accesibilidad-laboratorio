import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  MousePointer, 
  AlertTriangle, 
  CheckCircle, 
  Layout, 
  Users, 
  Smartphone,
  Search,
  Zap,
  FileText,
  BookOpen,
  Monitor,
  Sparkles,
  MessageSquare,
  ListChecks,
  RefreshCw
} from 'lucide-react';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Estados para la funcionalidad de IA
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState('humanize'); // 'humanize' | 'audit'
  const [aiError, setAiError] = useState(null);

  // Clave de API (vacía para ejecución en entorno seguro)
  const apiKey = "";

  const handleAiGenerate = async () => {
    if (!aiInput.trim()) return;
    
    setIsAiLoading(true);
    setAiError(null);
    setAiOutput('');

    try {
      let prompt = "";
      if (activeAiTab === 'humanize') {
        prompt = `Actúa como un experto en UX Writing. Tu tarea es reescribir el siguiente mensaje de error técnico para que sea amigable, claro y útil para un usuario final sin conocimientos técnicos. Aplica la heurística de "Relación entre el sistema y el mundo real".
        
        Mensaje técnico original: "${aiInput}"
        
        Genera solo el nuevo mensaje y una brevísima explicación de por qué es mejor.`;
      } else {
        prompt = `Actúa como un auditor de Accesibilidad Web (WCAG). Genera una lista de verificación (checklist) concisa de 3 a 5 puntos críticos que debo verificar para asegurar que el siguiente componente sea accesible.
        
        Componente a analizar: "${aiInput}"
        
        Formato: Lista con viñetas. Sé directo y práctico.`;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al conectar con Gemini');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar respuesta.";
      setAiOutput(text);

    } catch (err) {
      setAiError("Hubo un error al consultar a la IA. Por favor, intenta de nuevo.");
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const slides = [
    {
      id: 'intro',
      title: 'Fundamentos de Usabilidad y Accesibilidad',
      subtitle: 'Módulo: Diseño de Interfaces de Usuario',
      content: (
        <div className="space-y-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-6 rounded-full">
              <Monitor size={64} className="text-blue-600" />
            </div>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Bienvenidos, futuros desarrolladores. Hoy no hablaremos de código backend ni de bases de datos.
            Hablaremos de <strong>humanos</strong>.
          </p>
          <p className="text-lg text-gray-600">
            "La usabilidad es como el aire: solo notas que falta cuando te estás asfixiando."
          </p>
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 inline-block">
            <span className="font-semibold text-gray-800">Objetivo de la sesión:</span> Entender por qué una app que funciona técnicamente puede fallar en el mercado si no es usable.
          </div>
        </div>
      )
    },
    {
      id: 'definition',
      title: '¿Qué es la Usabilidad?',
      subtitle: 'ISO 9241-11',
      content: (
        <div className="space-y-8">
          <p className="text-lg text-gray-700">
            Según la norma ISO, la usabilidad se define por tres pilares fundamentales en un contexto de uso específico:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="text-green-600 mb-3" size={32} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Eficacia</h3>
                <p className="text-sm text-gray-600">¿El usuario puede completar la tarea y alcanzar su objetivo con exactitud?</p>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <MousePointer className="text-blue-600 mb-3" size={32} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Eficiencia</h3>
                <p className="text-sm text-gray-600">¿Cuántos recursos (tiempo, clics, esfuerzo mental) gasta el usuario para lograrlo?</p>
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Users className="text-purple-600 mb-3" size={32} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Satisfacción</h3>
                <p className="text-sm text-gray-600">¿La experiencia es libre de incomodidad y genera una actitud positiva?</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'heuristics',
      title: 'Las 10 Heurísticas de Nielsen',
      subtitle: 'Principios generales para el diseño de interacción',
      content: (
        <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-4 custom-scrollbar">
          <p className="text-sm text-gray-500 mb-4 sticky top-0 bg-white pb-2 z-10 border-b">
            Jakob Nielsen definió estas 10 reglas generales. Son la base para evaluar cualquier interfaz.
          </p>
          
          <div className="space-y-3">
            {[
              { title: "1. Visibilidad del estado", desc: "El usuario siempre debe saber qué pasa (ej. barra de carga).", icon: <Eye size={20} /> },
              { title: "2. Relación con el mundo real", desc: "Habla el lenguaje del usuario, no códigos de sistema.", icon: <Users size={20} /> },
              { title: "3. Control y libertad", desc: "Dale una 'salida de emergencia' (Deshacer/Rehacer).", icon: <Layout size={20} /> },
              { title: "4. Consistencia y estándares", desc: "No reinventes convenciones establecidas (ej. iconos estándar).", icon: <CheckCircle size={20} /> },
              { title: "5. Prevención de errores", desc: "Mejor evitar el error que mostrar un mensaje de error.", icon: <AlertTriangle size={20} /> },
              { title: "6. Reconocimiento antes que recuerdo", desc: "Haz visibles las opciones. No obligues a memorizar.", icon: <Search size={20} /> },
              { title: "7. Flexibilidad y eficiencia", desc: "Atajos para expertos (Accelerators) y simplicidad para novatos.", icon: <Zap size={20} /> },
              { title: "8. Estética y diseño minimalista", desc: "No incluyas información irrelevante que compita con lo importante.", icon: <Sparkles size={20} /> },
              { title: "9. Diagnóstico y recuperación de errores", desc: "Mensajes de error claros, en lenguaje llano y con solución.", icon: <RefreshCw size={20} /> },
              { title: "10. Ayuda y documentación", desc: "Aunque es mejor no necesitarla, debe ser fácil de buscar si hace falta.", icon: <FileText size={20} /> }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="bg-indigo-100 p-2 rounded-full mr-3 mt-1 text-indigo-700 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'accessibility',
      title: 'Accesibilidad (a11y)',
      subtitle: 'Diseño para TODOS',
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-gray-700 italic">
              "La accesibilidad es esencial para desarrolladores con discapacidades, pero útil para todos."
            </p>
          </div>
          
          <h3 className="font-bold text-gray-800 text-lg">Principios POUR (WCAG):</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
              <span className="text-indigo-600 font-black text-xl block mb-1">P</span>
              <span className="font-bold text-gray-800">Perceptible</span>
              <p className="text-xs text-gray-500 mt-1">La información no puede ser invisible a los sentidos (ej. texto alternativo en imágenes).</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
              <span className="text-indigo-600 font-black text-xl block mb-1">O</span>
              <span className="font-bold text-gray-800">Operable</span>
              <p className="text-xs text-gray-500 mt-1">La interfaz debe poder usarse (ej. navegación solo con teclado).</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
              <span className="text-indigo-600 font-black text-xl block mb-1">U</span>
              <span className="font-bold text-gray-800">Comprensible</span>
              <p className="text-xs text-gray-500 mt-1">Información y operaciones claras (ej. formularios predecibles).</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
              <span className="text-indigo-600 font-black text-xl block mb-1">R</span>
              <span className="font-bold text-gray-800">Robusto</span>
              <p className="text-xs text-gray-500 mt-1">Compatible con tecnologías presentes y futuras (ej. lectores de pantalla).</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'demo',
      title: 'Ejemplo Práctico',
      subtitle: 'Contraste y Tamaño de Objetivo',
      content: (
        <div className="space-y-8">
          <p className="text-gray-600 mb-4">¿Cuál de estos botones es más fácil de usar en un móvil bajo el sol?</p>
          
          <div className="grid grid-cols-2 gap-8 items-center justify-items-center">
            {/* Bad Example */}
            <div className="flex flex-col items-center space-y-2 w-full">
              <div className="text-red-500 font-bold mb-2 flex items-center"><AlertTriangle size={16} className="mr-1"/> Mal Diseño</div>
              <button className="bg-gray-300 text-gray-400 px-2 py-1 text-xs rounded shadow-none cursor-pointer w-24 h-8 flex items-center justify-center">
                Enviar
              </button>
              <ul className="text-xs text-gray-500 list-disc pl-4 text-left w-full">
                <li>Bajo contraste</li>
                <li>Área de clic pequeña</li>
                <li>Sin feedback visual claro</li>
              </ul>
            </div>

            {/* Good Example */}
            <div className="flex flex-col items-center space-y-2 w-full">
              <div className="text-green-600 font-bold mb-2 flex items-center"><CheckCircle size={16} className="mr-1"/> Buen Diseño</div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors w-full max-w-[140px] focus:ring-4 focus:ring-blue-300 focus:outline-none">
                Enviar
              </button>
              <ul className="text-xs text-gray-500 list-disc pl-4 text-left w-full">
                <li>Alto contraste (AAA)</li>
                <li>Área táctil &gt; 44px</li>
                <li>Estados Hover/Focus</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ai-lab',
      title: 'Laboratorio de IA ✨',
      subtitle: 'Asistente de UX y Accesibilidad en vivo',
      content: (
        <div className="flex flex-col h-full">
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg self-center">
            <button
              onClick={() => { setActiveAiTab('humanize'); setAiOutput(''); setAiInput(''); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${activeAiTab === 'humanize' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MessageSquare size={18} />
              <span>Humanizar Error</span>
            </button>
            <button
              onClick={() => { setActiveAiTab('audit'); setAiOutput(''); setAiInput(''); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${activeAiTab === 'audit' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ListChecks size={18} />
              <span>Checklist A11y</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
            {/* Input Section */}
            <div className="flex flex-col space-y-4">
              <label className="text-sm font-semibold text-gray-700">
                {activeAiTab === 'humanize' 
                  ? 'Introduce un mensaje de error técnico:' 
                  : 'Describe un componente de interfaz:'}
              </label>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none resize-none flex-grow shadow-inner text-sm"
                placeholder={activeAiTab === 'humanize' 
                  ? 'Ej: Error 500: Internal Server Error at line 45...' 
                  : 'Ej: Un menú de navegación desplegable (dropdown) con submenús.'}
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
              />
              <button
                onClick={handleAiGenerate}
                disabled={isAiLoading || !aiInput.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    <span>Pensando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="text-yellow-300" />
                    <span>{activeAiTab === 'humanize' ? 'Reescribir con IA' : 'Generar Checklist'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-y-auto relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-50"></div>
              {aiOutput ? (
                <div className="prose prose-sm prose-indigo">
                  <h4 className="text-indigo-800 font-bold flex items-center mb-2">
                    <Sparkles size={16} className="mr-2 text-indigo-500" /> Respuesta de Gemini:
                  </h4>
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {aiOutput}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                  <div className="bg-white p-4 rounded-full shadow-sm">
                    {activeAiTab === 'humanize' ? <MessageSquare size={32} /> : <ListChecks size={32} />}
                  </div>
                  <p className="text-center text-sm">
                    {activeAiTab === 'humanize' 
                      ? 'La IA transformará tu mensaje técnico en lenguaje humano.' 
                      : 'Obtén puntos clave de accesibilidad para tu diseño.'}
                  </p>
                </div>
              )}
              {aiError && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
                  <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                  {aiError}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'conclusion',
      title: 'Conclusiones',
      subtitle: 'Tu responsabilidad como desarrollador',
      content: (
        <div className="text-center space-y-6">
          <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4">La usabilidad no es "ponerlo bonito"</h3>
            <p className="text-indigo-200 mb-6">
              Es asegurarse de que la tecnología sirva a las personas, y no al revés.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
              <div className="flex items-center">
                <CheckCircle className="text-green-400 mr-2" />
                <span>Testea con usuarios reales siempre que puedas.</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-400 mr-2" />
                <span>Usa etiquetas semánticas HTML (nav, main, button).</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-400 mr-2" />
                <span>Valida el contraste de colores.</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-400 mr-2" />
                <span>Nunca uses solo color para transmitir información.</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(curr => curr + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent slide navigation if user is typing in the textarea
      if (document.activeElement.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-slate-800 w-100">
      <div className="max-w-4xl  bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[700px]">
        
        {/* Header / Progress Bar */}
        <div className=" bg-slate-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen size={20} className="text-blue-400" />
            <span className="font-bold tracking-wider text-sm md:text-base">MÓDULO UX/UI</span>
          </div>
          <div className="flex space-x-1 ">
            {slides.map((_, idx) => (
              <div 
                key={idx}
                className={` h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`}
              />
            ))}
          </div>
          <div className="text-xs text-slate-400">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        {/* Slide Content */}
        <div className="flex-grow p-8 md:p-12 flex flex-col relative overflow-y-auto min-w-[896px]">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 transition-all duration-300 ease-in-out">
              {slides[currentSlide].title}
            </h1>
            <h2 className="text-xl text-blue-600 font-medium">
              {slides[currentSlide].subtitle}
            </h2>
          </div>
                  
        <div className="flex-grow animate-fadeIn h-full flex flex-col ">
          {slides[currentSlide].content}
        </div>

        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-100 p-6 flex justify-between items-center bg-gray-50">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${currentSlide === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-slate-700 hover:bg-gray-200'}`}
          >
            <ChevronLeft size={20} />
            <span>Anterior</span>
          </button>

          <div className="hidden md:block text-xs text-gray-400">
            Usa las flechas del teclado ← → para navegar
          </div>

          <button 
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${currentSlide === slides.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}
          >
            <span>{currentSlide === slides.length - 1 ? 'Fin' : 'Siguiente'}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Presentation;