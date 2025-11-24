import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
  BookOpen,
  Monitor,
  Sparkles,
  MessageSquare,
  ListChecks,
  RefreshCw,
  Search,
  Zap,
  HelpCircle,
  FileText,
  Settings,
  Key,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Estado para la expansión de heurísticas (Acordeón)
  const [expandedHeuristic, setExpandedHeuristic] = useState(null);

  // Estados para la funcionalidad de IA
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState('humanize'); // 'humanize' | 'audit'
  const [aiError, setAiError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');

  // Clave de API por defecto (vacía para inyección de entorno)
  const defaultApiKey = "";

  const toggleHeuristic = (index) => {
    setExpandedHeuristic(expandedHeuristic === index ? null : index);
  };

  const handleAiGenerate = async () => {
    if (!aiInput.trim()) return;
    
    const keyToUse = userApiKey.trim() || defaultApiKey;

    setIsAiLoading(true);
    setAiError(null);
    setAiOutput('');

    try {
      let prompt = "";
      if (activeAiTab === 'humanize') {
        prompt = `Actúa como un experto en UX Writing. Reescribe este mensaje de error técnico para que sea amigable y claro para un usuario final. Usa formato Markdown (negritas, listas si es necesario).
        Mensaje original: "${aiInput}"`;
      } else {
        prompt = `Actúa como un auditor WCAG. Dame un checklist de 3 puntos críticos de accesibilidad para: "${aiInput}". Usa formato Markdown (listas, negritas) y bien formateado.`;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${keyToUse}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      if (!response.ok) {
        if (response.status === 403) throw new Error('Error 403: Acceso denegado. Configura tu API Key.');
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAiOutput(data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta.");

    } catch (err) {
      setAiError(err.message);
      if (err.message.includes('403')) setShowSettings(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  const heuristicsData = [
    { 
      title: "1. Visibilidad del estado", 
      icon: <Eye size={20} />,
      desc: "El usuario siempre debe saber qué pasa.",
      examples: [
        "🛒 E-commerce: 'Paso 2 de 3: Datos de envío'.",
        "🔋 Hardware: Icono de batería cambiando de verde a rojo.",
        "⏳ Carga: Spinner o barra de progreso al subir un archivo."
      ]
    },
    { 
      title: "2. Relación con el mundo real", 
      icon: <Users size={20} />,
      desc: "Habla el lenguaje del usuario, no códigos.",
      examples: [
        "🗑️ Metáfora: Icono de 'Papelera' para borrar archivos.",
        "💳 Tarjetas: El formulario de tarjeta de crédito imita la tarjeta física.",
        "❌ Malo: 'Error System.NullReference' (¿Qué significa?)."
      ]
    },
    { 
      title: "3. Control y libertad", 
      icon: <Layout size={20} />,
      desc: "Salidas de emergencia para errores.",
      examples: [
        "↩️ Deshacer: 'Ctrl+Z' en editores de texto.",
        "🗑️ Gmail: Mensaje 'Deshacer envío' justo después de enviar.",
        "🚪 Modal: Botón claro de 'X' o 'Cancelar' siempre visible."
      ]
    },
    { 
      title: "4. Consistencia y estándares", 
      icon: <CheckCircle size={20} />,
      desc: "Sigue las convenciones establecidas.",
      examples: [
        "🔴 Colores: Rojo siempre para 'Stop', 'Borrar' o 'Error'.",
        "📍 Ubicación: Logo arriba a la izquierda lleva a Inicio.",
        "⌨️ Atajos: Ctrl+C siempre copia, no inventes otro."
      ]
    },
    { 
      title: "5. Prevención de errores", 
      icon: <AlertTriangle size={20} />,
      desc: "Diseño que evita que el fallo ocurra.",
      examples: [
        "📅 Fechas: Selector de calendario evita formatos inválidos (DD/MM vs MM/DD).",
        "🔍 Google: 'Quizás quisiste decir...' si escribes mal.",
        "📎 Adjuntos: Aviso 'Mencionaste adjunto pero no hay archivo' en Gmail."
      ]
    },
    { 
      title: "6. Reconocimiento antes que recuerdo", 
      icon: <Search size={20} />,
      desc: "Haz visibles las opciones.",
      examples: [
        "📝 Fuentes: Ver la previsualización de la fuente en el menú desplegable.",
        "🛍️ Recientes: Mostrar 'Visto recientemente' en tiendas.",
        "🔎 Búsqueda: Historial visible al hacer clic en la barra de búsqueda."
      ]
    },
    { 
      title: "7. Flexibilidad y eficiencia", 
      icon: <Zap size={20} />,
      desc: "Atajos para expertos, sencillez para novatos.",
      examples: [
        "📸 Instagram: Doble tap para like (atajo) vs botón corazón.",
        "🖥️ Excel: Macros o atajos de teclado para usuarios avanzados.",
        "🎨 Personalización: Poder ordenar el dashboard a tu gusto."
      ]
    },
    { 
      title: "8. Estética y diseño minimalista", 
      icon: <Sparkles size={20} />,
      desc: "Menos es más. Solo información relevante.",
      examples: [
        "🔍 Google: Página de inicio limpia, solo la barra de búsqueda.",
        "📄 Formulario: Pedir solo datos esenciales (quitar 'Fax' o 'Segundo Apellido').",
        "📱 Móvil: Ocultar menús secundarios en un icono 'hamburguesa'."
      ]
    },
    { 
      title: "9. Diagnóstico y recuperación", 
      icon: <RefreshCw size={20} />,
      desc: "Errores claros con solución.",
      examples: [
        "🚫 404: 'Página no encontrada. Prueba buscando aquí [Barra]'.",
        "🔒 Login: 'Contraseña incorrecta. ¿Olvidaste tu contraseña?'.",
        "📶 Conexión: 'Sin internet. Reintentando en 5s...'."
      ]
    },
    { 
      title: "10. Ayuda y documentación", 
      icon: <FileText size={20} />,
      desc: "Fácil de buscar y centrada en tareas.",
      examples: [
        "💡 Onboarding: Pequeño tour guiado al abrir la app por primera vez.",
        "❓ Tooltips: Iconos '?' explicativos al lado de campos complejos.",
        "📚 Chatbot: Ayuda contextual rápida sin salir de la página."
      ]
    }
  ];

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
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
               <h3 className="font-bold text-orange-800 mb-2">Objetivo 1: Usabilidad</h3>
               <p className="text-sm text-gray-600">Que el usuario no tenga que pensar para usar tu app.</p>
            </div>
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
               <h3 className="font-bold text-teal-800 mb-2">Objetivo 2: Accesibilidad</h3>
               <p className="text-sm text-gray-600">Que nadie se quede fuera, independientemente de sus capacidades.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'definition',
      title: '¿Qué es la Usabilidad?',
      subtitle: 'ISO 9241-11: Eficacia, Eficiencia, Satisfacción',
      content: (
        <div className="space-y-8">
          <p className="text-lg text-gray-700">
            Según la norma ISO, la usabilidad se define por tres pilares. Veamos ejemplos:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="text-green-600 mb-3" size={32} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Eficacia</h3>
                <p className="text-sm text-gray-600 italic mb-2">"Lo logro hacer"</p>
                <div className="text-xs text-left w-full bg-white p-2 rounded border border-green-200 text-gray-500">
                  Ej: Lograr comprar una entrada de cine sin que la app se cuelgue o me cobre doble.
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <MousePointer className="text-blue-600 mb-3" size={32} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Eficiencia</h3>
                <p className="text-sm text-gray-600 italic mb-2">"Lo hago rápido"</p>
                <div className="text-xs text-left w-full bg-white p-2 rounded border border-blue-200 text-gray-500">
                  Ej: Comprar esa entrada en 3 clics gracias a "Recordar mis datos" vs escribir todo de nuevo.
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Users className="text-purple-600 mb-3" size={32} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Satisfacción</h3>
                <p className="text-sm text-gray-600 italic mb-2">"Me siento bien"</p>
                <div className="text-xs text-left w-full bg-white p-2 rounded border border-purple-200 text-gray-500">
                  Ej: Que la confirmación sea visualmente agradable y me dé seguridad de la compra.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'heuristics',
      title: 'Las 10 Heurísticas de Nielsen',
      subtitle: 'Haz clic para ver ejemplos prácticos',
      content: (
        <div className="h-full flex flex-col">
          <p className="text-sm text-gray-500 mb-2">
             Estas reglas aplican a todo: web, apps móviles, cajeros automáticos, incluso microondas.
          </p>
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-2 pb-4">
            {heuristicsData.map((item, idx) => (
              <div 
                key={idx} 
                className={`border rounded-lg transition-all duration-200 ${expandedHeuristic === idx ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <button 
                  onClick={() => toggleHeuristic(idx)}
                  className="w-full flex items-center justify-between p-3 text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${expandedHeuristic === idx ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-500'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${expandedHeuristic === idx ? 'text-indigo-900' : 'text-gray-700'}`}>{item.title}</h4>
                      {expandedHeuristic !== idx && <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-md">{item.desc}</p>}
                    </div>
                  </div>
                  {expandedHeuristic === idx ? <ChevronUp size={18} className="text-indigo-500"/> : <ChevronDown size={18} className="text-gray-400"/>}
                </button>
                
                {expandedHeuristic === idx && (
                  <div className="px-4 pb-4 pt-0 animate-fadeIn">
                    <p className="text-sm text-indigo-700 font-medium mb-2">{item.desc}</p>
                    <div className="space-y-2">
                      {item.examples.map((ex, i) => (
                        <div key={i} className="flex items-start text-xs text-gray-700 bg-white p-2 rounded border border-indigo-100">
                          <span className="mr-2 mt-0.5">•</span>
                          <span>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'accessibility',
      title: 'Accesibilidad (a11y)',
      subtitle: 'Ejemplos para los 4 Principios (POUR)',
      content: (
        <div className="space-y-4 overflow-y-auto h-full pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border-l-4 border-indigo-500 rounded shadow-sm">
              <div className="flex items-center mb-2">
                 <span className="text-indigo-600 font-black text-xl mr-2">P</span>
                 <h4 className="font-bold text-gray-800">Perceptible</h4>
              </div>
              <p className="text-xs text-gray-500 mb-3 border-b pb-2">"Puedo recibir la información (verla, oírla, tocarla)"</p>
              <ul className="text-xs space-y-2 text-gray-700">
                 <li>👁️ <strong>Ceguera:</strong> Texto alternativo en imágenes para lectores de pantalla.</li>
                 <li>🔇 <strong>Sordera:</strong> Subtítulos (Closed Captions) en vídeos.</li>
                 <li>👴 <strong>Vista cansada:</strong> Texto redimensionable sin romperse.</li>
              </ul>
            </div>

            <div className="p-4 bg-white border-l-4 border-purple-500 rounded shadow-sm">
              <div className="flex items-center mb-2">
                 <span className="text-purple-600 font-black text-xl mr-2">O</span>
                 <h4 className="font-bold text-gray-800">Operable</h4>
              </div>
              <p className="text-xs text-gray-500 mb-3 border-b pb-2">"Puedo interactuar con la interfaz"</p>
              <ul className="text-xs space-y-2 text-gray-700">
                 <li>⌨️ <strong>Motor (Parkinson):</strong> Botones grandes y separación suficiente.</li>
                 <li>🖱️ <strong>Sin ratón:</strong> Toda la web navegable con TAB y ENTER.</li>
                 <li>⚡ <strong>Epilepsia:</strong> Evitar parpadeos rápidos ({'>'}3 veces/seg).</li>
              </ul>
            </div>

            <div className="p-4 bg-white border-l-4 border-blue-500 rounded shadow-sm">
              <div className="flex items-center mb-2">
                 <span className="text-blue-600 font-black text-xl mr-2">U</span>
                 <h4 className="font-bold text-gray-800">Comprensible</h4>
              </div>
              <p className="text-xs text-gray-500 mb-3 border-b pb-2">"Entiendo cómo funciona y qué dice"</p>
              <ul className="text-xs space-y-2 text-gray-700">
                 <li>🌍 <strong>Idioma:</strong> Definir el idioma de la página (`lang="es"`).</li>
                 <li>🧠 <strong>Cognitivo:</strong> Navegación consistente (Menú siempre igual).</li>
                 <li>📝 <strong>Formularios:</strong> Etiquetas claras y visibles, no solo placeholders.</li>
              </ul>
            </div>

            <div className="p-4 bg-white border-l-4 border-teal-500 rounded shadow-sm">
              <div className="flex items-center mb-2">
                 <span className="text-teal-600 font-black text-xl mr-2">R</span>
                 <h4 className="font-bold text-gray-800">Robusto</h4>
              </div>
              <p className="text-xs text-gray-500 mb-3 border-b pb-2">"Funciona en diferentes tecnologías"</p>
              <ul className="text-xs space-y-2 text-gray-700">
                 <li>📱 <strong>Móvil:</strong> Funciona en pantallas verticales y horizontales.</li>
                 <li>🗣️ <strong>Asistentes:</strong> Código HTML válido para que Siri/Alexa lo lean bien.</li>
                 <li>🕸️ <strong>Compatibilidad:</strong> Se ve bien en Chrome, Firefox y Safari.</li>
              </ul>
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
        <div className="flex flex-col h-full relative">
          
          {/* Settings Toggle */}
          <div className="absolute right-0 top-[-30px] md:top-0">
             <button 
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
             >
                <Settings size={14} />
                <span>Configuración API</span>
             </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
             <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-fadeIn text-sm">
                <div className="flex items-start justify-between mb-2">
                    <h5 className="font-bold text-gray-700 flex items-center">
                        <Key size={16} className="mr-2 text-indigo-500"/>
                        Configurar Gemini API Key
                    </h5>
                    <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                   Si ves un error 403, necesitas tu propia clave. Consigue una gratis en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Google AI Studio</a>.
                </p>
                <input 
                   type="password" 
                   placeholder="Pega tu API Key aquí (comienza con AIza...)" 
                   value={userApiKey}
                   onChange={(e) => setUserApiKey(e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                />
             </div>
          )}

          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg self-center mt-2">
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
                  <ReactMarkdown>
                    {aiOutput}
                  </ReactMarkdown>
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
                  <span className="flex-grow">{aiError}</span>
                  {(aiError.includes('403') || aiError.includes('400')) && (
                      <button 
                        onClick={() => setShowSettings(true)}
                        className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                      >
                        Configurar
                      </button>
                  )}
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
          <p className="text-sm text-gray-500 mt-8">Guillermo Mauro Marion López | Ciclo Superior Desarrollo de Software</p>
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
      // Prevent slide navigation if user is typing in the textarea or input
      if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[700px]">
        
        {/* Header / Progress Bar */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen size={20} className="text-blue-400" />
            <span className="font-bold tracking-wider text-sm md:text-base">MÓDULO UX/UI</span>
          </div>
          <div className="flex space-x-1">
            {slides.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`}
              />
            ))}
          </div>
          <div className="text-xs text-slate-400">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        {/* Slide Content */}
        <div className="flex-grow p-8 md:p-12 flex flex-col relative overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 transition-all duration-300 ease-in-out">
              {slides[currentSlide].title}
            </h1>
            <h2 className="text-xl text-blue-600 font-medium">
              {slides[currentSlide].subtitle}
            </h2>
          </div>
          
          <div className="flex-grow animate-fadeIn h-full flex flex-col">
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
        /* Custom scrollbar for heuristics list */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Presentation;