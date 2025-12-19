import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { toPng } from "html-to-image";
import { Code2, Download } from "lucide-react";

const THEMES = [
  { name: "Hyper Blue", class: "from-blue-600 via-cyan-400 to-indigo-500" },
  { name: "Oceanic", class: "from-green-300 via-blue-500 to-purple-600" },
  { name: "Cotton Candy", class: "from-pink-300 via-purple-300 to-indigo-400" },
  { name: "Sunset", class: "from-orange-500 via-red-500 to-pink-500" },
  { name: "Deep Space", class: "from-gray-900 via-blue-900 to-black" },
  { name: "Northern Lights", class: "from-teal-900 via-emerald-400 to-gray-900" },
  { name: "Midnight City", class: "from-purple-900 via-indigo-800 to-blue-900" },
  { name: "Toxic", class: "from-lime-400 via-emerald-500 to-teal-700" },
  { name: "Flamingo", class: "from-rose-400 via-fuchsia-500 to-indigo-500" },
  { name: "Solaris", class: "from-yellow-200 via-orange-500 to-red-600" },
  { name: "Cyberpunk", class: "from-yellow-400 via-pink-500 to-purple-600" },
  { name: "Ghost", class: "from-slate-300 via-slate-100 to-slate-400" },
];
export default function App() {
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [language, setLanguage] = useState("javascript");
  const exportRef = useRef(null);

  const handleDownload = async () => {
    if (exportRef.current === null) return;
    const dataUrl = await toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `code-snippet-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20">
      {/* --- NAVBAR --- */}
      <nav className="border-b border-white/10 px-8 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Code2 size={20} />
          </div>
          <span className="font-bold tracking-tight">SnippetStudio.io</span>
        </div>
        
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all active:scale-95"
        >
          <Download size={18} />
          Export Image
        </button>
      </nav>

      <main className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* --- LEFT SIDEBAR: CONTROLS --- */}
        <div className="space-y-8">
          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4 block">Background Theme</label>
            <div className="grid grid-cols-4 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setCurrentTheme(t)}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.class} border-2 transition-all ${
                    currentTheme.name === t.name ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "border-transparent hover:scale-105"
                  }`}
                  title={t.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4 block">Language</label>
            <select 
              className="w-full bg-gray-900 border border-white/10 rounded-lg p-3 outline-none focus:ring-2 ring-indigo-500 transition-all"
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE EDITOR PREVIEW --- */}
        <div className="lg:col-span-3 flex justify-center items-start">
          <div 
            ref={exportRef}
            className={`p-12 md:p-20 rounded-xl bg-gradient-to-br ${currentTheme.class} transition-all duration-700 ease-in-out shadow-2xl`}
          >
            <div className="bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-black/20 min-w-[300px] md:min-w-[600px]">
              {/* Window Header */}
              <div className="flex items-center gap-2 px-4 py-4 bg-[#1e1e1e]/50 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="mx-auto text-xs text-gray-500 font-medium opacity-50">
                  untitled-{language}.js
                </div>
              </div>
              
              <Editor
                height="350px"
                language={language}
                defaultValue="// Paste your beautiful code here..."
                theme="vs-dark"
                options={{
                  fontSize: 16,
                  fontFamily: "Fira Code, monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  padding: { top: 20, bottom: 20 },
                  roundedSelection: true,
                  cursorStyle: "line",
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}