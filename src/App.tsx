import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { toPng } from "html-to-image";
import { Code2, Download } from "lucide-react";
import './App.css'

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
  {
    "name": "Neon Genesis",
    "class": "from-fuchsia-600 via-purple-700 to-lime-400",
    "description": "Inspired by Unit-01: Deep purple and acidic green."
  },
  {
    "name": "Cyber Rain",
    "class": "from-gray-900 via-blue-900 to-cyan-500",
    "description": "Ghost in the Shell vibes: Cold, clinical, and futuristic."
  },
  {
    "name": "Sailor Moon",
    "class": "from-pink-300 via-purple-300 to-blue-300",
    "description": "Pastel magical girl aesthetic: Soft pinks and dreamy blues."
  },
  {
    "name": "Super Saiyan",
    "class": "from-yellow-400 via-orange-500 to-red-600",
    "description": "High energy: Golden aura and fiery orange."
  },
  {
    "name": "Akira Slide",
    "class": "from-red-700 via-red-600 to-gray-900",
    "description": "The iconic motorcycle: Deep reds and asphalt blacks."
  },
  {
    "name": "Lo-Fi Girl",
    "class": "from-orange-200 via-rose-300 to-indigo-400",
    "description": "Studying at 3 AM: Warm lamp light and sunset skies."
  },
  {
    "name": "One Piece Blue",
    "class": "from-blue-400 via-cyan-300 to-yellow-200",
    "description": "Grand Line adventures: Tropical ocean and sunny skies."
  },
  {
    "name": "Hollow Mask",
    "class": "from-white via-gray-200 to-red-600",
    "description": "Bleach inspired: Bone white with a flash of blood red."
  },
  {
    "name": "Forest Spirit",
    "class": "from-emerald-900 via-green-500 to-yellow-100",
    "description": "Studio Ghibli vibes: Lush moss and dappled sunlight."
  },
  {
    "name": "Tokyo Ghoul",
    "class": "from-gray-800 via-red-900 to-black",
    "description": "Dark fantasy: Crimson kagune and shadows."
  },
  {
    "name": "Event Horizon",
    "class": "from-black via-purple-950 to-indigo-900",
    "description": "Deep space void with a hint of purple radiation."
  },
  {
    "name": "Matrix Glitch",
    "class": "from-green-900 via-black to-emerald-600",
    "description": "Digital rain aesthetic for the hardcore hackers."
  },
  {
    "name": "Plasma Neon",
    "class": "from-indigo-600 via-fuchsia-500 to-cyan-400",
    "description": "High-energy glow that makes code pop."
  },
  {
    "name": "Retro Future",
    "class": "from-orange-500 via-purple-600 to-blue-600",
    "description": "80s Synthwave sunset vibes."
  },
  {
    "name": "Submerged",
    "class": "from-teal-400 via-blue-500 to-indigo-600",
    "description": "Deep water gradients for a professional look."
  },
  {
    "name": "Velvet",
    "class": "from-gray-900 via-rose-900 to-gray-900",
    "description": "Sophisticated dark mode with a hint of wine red."
  },
  {
    "name": "Midnight Gold",
    "class": "from-gray-900 via-slate-800 to-yellow-600/20",
    "description": "Dark and luxury-focused."
  },
  {
    "name": "Aura Borealis",
    "class": "from-green-300 via-purple-400 to-indigo-500",
    "description": "A soft, shifting aurora effect."
  }
];

export const EDITOR_THEMES = [
  {
    id: "vs-dark",
    name: "Visual Studio Dark",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {}
    }
  },
  // 1
  {
    id: "dracula-soft",
    name: "Dracula Soft",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4", fontStyle: "italic" },
        { token: "keyword", foreground: "ff79c6" },
        { token: "string", foreground: "f1fa8c" },
      ],
      colors: { "editor.background": "#282a36" }
    }
  },

  // 2
  {
    id: "nord-night",
    name: "Nord Night",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "81a1c1" },
        { token: "string", foreground: "a3be8c" },
        { token: "comment", foreground: "616e88" },
      ],
      colors: { "editor.background": "#2e3440" }
    }
  },

  // 3
  {
    id: "solarized-dark",
    name: "Solarized Dark",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "268bd2" },
        { token: "string", foreground: "2aa198" },
        { token: "comment", foreground: "586e75" },
      ],
      colors: { "editor.background": "#002b36" }
    }
  },

  // 4
  {
    id: "github-dark",
    name: "GitHub Dark",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "ff7b72" },
        { token: "string", foreground: "a5d6ff" },
      ],
      colors: { "editor.background": "#0d1117" }
    }
  },

  // 5
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "7aa2f7" },
        { token: "string", foreground: "9ece6a" },
      ],
      colors: { "editor.background": "#1a1b26" }
    }
  },

  // 6
  {
    id: "ayu-dark",
    name: "Ayu Dark",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "ffb454" },
        { token: "string", foreground: "aad94c" },
      ],
      colors: { "editor.background": "#0f1419" }
    }
  },

  // 7
  {
    id: "material-ocean",
    name: "Material Ocean",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "c792ea" },
        { token: "string", foreground: "ecc48d" },
      ],
      colors: { "editor.background": "#263238" }
    }
  },

  // 8
  {
    id: "neon-blue",
    name: "Neon Blue",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "00eaff" },
        { token: "string", foreground: "9efeff" },
      ],
      colors: { "editor.background": "#020617" }
    }
  },

  // 9
  {
    id: "matrix-green",
    name: "Matrix Green",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "00ff9c" },
        { token: "string", foreground: "7dffb3" },
      ],
      colors: { "editor.background": "#000000" }
    }
  },

  // 10
  {
    id: "gruvbox-dark",
    name: "Gruvbox Dark",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "fb4934" },
        { token: "string", foreground: "b8bb26" },
      ],
      colors: { "editor.background": "#282828" }
    }
  },

  // 11
  {
    id: "one-dark-pro",
    name: "One Dark Pro",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "c678dd" },
        { token: "string", foreground: "98c379" },
      ],
      colors: { "editor.background": "#21252b" }
    }
  },

  // 12
  {
    id: "vaporwave",
    name: "Vaporwave",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "ff71ce" },
        { token: "string", foreground: "01cdfe" },
      ],
      colors: { "editor.background": "#1b0033" }
    }
  },

  // 13
  {
    id: "deep-space",
    name: "Deep Space",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "8be9fd" },
        { token: "string", foreground: "50fa7b" },
      ],
      colors: { "editor.background": "#0b1021" }
    }
  },

  // 14
  {
    id: "carbon",
    name: "Carbon",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "f08d49" },
        { token: "string", foreground: "73c990" },
      ],
      colors: { "editor.background": "#161616" }
    }
  },

  // 15
  {
    id: "amber-terminal",
    name: "Amber Terminal",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "ffbf00" },
        { token: "string", foreground: "ffd866" },
      ],
      colors: { "editor.background": "#1a1400" }
    }
  },

  // 16
  {
    id: "rose-pine",
    name: "Rose Pine",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "eb6f92" },
        { token: "string", foreground: "f6c177" },
      ],
      colors: { "editor.background": "#191724" }
    }
  },

  // 17
  {
    id: "slate",
    name: "Slate",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "94a3b8" },
        { token: "string", foreground: "cbd5f5" },
      ],
      colors: { "editor.background": "#0f172a" }
    }
  },

  // 18
  {
    id: "forest-night",
    name: "Forest Night",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "7fb77e" },
        { token: "string", foreground: "d2f898" },
      ],
      colors: { "editor.background": "#0b1f16" }
    }
  },

  // 19
  {
    id: "mono-dark",
    name: "Mono Dark",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "ffffff" },
        { token: "string", foreground: "bbbbbb" },
      ],
      colors: { "editor.background": "#111111" }
    }
  },

  // 20
  {
    id: "ai-focus",
    name: "AI Focus",
    config: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "00ffd5" },
        { token: "string", foreground: "aaffee" },
      ],
      colors: {
        "editor.background": "#050a0f",
        "editor.lineHighlightBackground": "#00ffd520"
      }
    }
  }
];

export const LANGUAGE_OPTIONS = [
  { id: "javascript", name: "JavaScript", ext: "js" },
  { id: "typescript", name: "TypeScript", ext: "ts" },
  { id: "python", name: "Python", ext: "py" },
  { id: "java", name: "Java", ext: "java" },
  { id: "csharp", name: "C#", ext: "cs" },
  { id: "cpp", name: "C++", ext: "cpp" },
  { id: "html", name: "HTML", ext: "html" },
  { id: "css", name: "CSS", ext: "css" },
  { id: "json", name: "JSON", ext: "json" },
  { id: "rust", name: "Rust", ext: "rs" },
  { id: "go", name: "Go", ext: "go" },
  { id: "ruby", name: "Ruby", ext: "rb" },

  { id: "php", name: "PHP", ext: "php" },
  { id: "swift", name: "Swift", ext: "swift" },
  { id: "kotlin", name: "Kotlin", ext: "kt" },
  { id: "scala", name: "Scala", ext: "scala" },
  { id: "dart", name: "Dart", ext: "dart" },
  { id: "r", name: "R", ext: "r" },
  { id: "matlab", name: "MATLAB", ext: "m" },

  { id: "bash", name: "Bash", ext: "sh" },
  { id: "powershell", name: "PowerShell", ext: "ps1" },
  { id: "sql", name: "SQL", ext: "sql" },
  { id: "yaml", name: "YAML", ext: "yaml" },
  { id: "toml", name: "TOML", ext: "toml" },
  { id: "xml", name: "XML", ext: "xml" },
  { id: "markdown", name: "Markdown", ext: "md" },
  { id: "shell", name: "Shell", ext: "sh" },

  { id: "perl", name: "Perl", ext: "pl" },
  { id: "lua", name: "Lua", ext: "lua" },
  { id: "groovy", name: "Groovy", ext: "groovy" },
  { id: "objective-c", name: "Objective-C", ext: "m" },
  { id: "objective-cpp", name: "Objective-C++", ext: "mm" },
  { id: "solidity", name: "Solidity", ext: "sol" },

  { id: "hcl", name: "HCL (Terraform)", ext: "tf" },
  { id: "dockerfile", name: "Dockerfile", ext: "Dockerfile" },
  { id: "makefile", name: "Makefile", ext: "Makefile" },
  { id: "nginx", name: "Nginx", ext: "conf" },
  { id: "graphql", name: "GraphQL", ext: "graphql" },
  { id: "protobuf", name: "Protocol Buffers", ext: "proto" },

  { id: "clojure", name: "Clojure", ext: "clj" },
  { id: "elixir", name: "Elixir", ext: "ex" },
  { id: "erlang", name: "Erlang", ext: "erl" },
  { id: "haskell", name: "Haskell", ext: "hs" },
  { id: "julia", name: "Julia", ext: "jl" },

  { id: "nim", name: "Nim", ext: "nim" },
  { id: "zig", name: "Zig", ext: "zig" },
  { id: "fortran", name: "Fortran", ext: "f90" },
  { id: "cobol", name: "COBOL", ext: "cbl" },
  { id: "asm", name: "Assembly", ext: "asm" },

  { id: "plaintext", name: "Plain Text", ext: "txt" }
];

export default function App() { 
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [language, setLanguage] = useState("javascript");
  const [currentEditorTheme, setCurrentEditorTheme] = useState(EDITOR_THEMES[0]);
  const exportRef = useRef(null);

  const handleDownload = async () => {
    if (exportRef.current === null) return;
    const dataUrl = await toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `code-snippet-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleEditorWillMount = (monaco: any) => {
    // We register all our custom themes here
    EDITOR_THEMES.forEach(theme => {
      monaco.editor.defineTheme(theme.id, theme.config);
    });
  };
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20">
      <main className="max-w-6xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">

        {/* --- LEFT SIDEBAR: CONTROLS --- */}
        <div className="space-y-8">
          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4 block">Background Theme</label>
            <div className="grid grid-cols-4 gap-3 h-50 overflow-y-auto scroll-mac p-2">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setCurrentTheme(t)}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.class} border-2 transition-all ${currentTheme.name === t.name ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "border-transparent hover:scale-105"
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
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4 block">Editor Themes</label>
            <select
              className="w-full bg-gray-900 border border-white/10 rounded-lg p-3 outline-none focus:ring-2 ring-indigo-500 transition-all"
              onChange={(e) => setCurrentEditorTheme(EDITOR_THEMES.find(t => t.id === e.target.value)!)}
            >
              {EDITOR_THEMES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
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
                  untitled.{language === "plaintext" ? "txt" : LANGUAGE_OPTIONS.find(l => l.id === language)?.ext}
                </div>
              </div>

              <Editor
                height="350px"
                language={language}
                defaultValue="// Paste your beautiful code here..."
                theme={currentEditorTheme.id}
                beforeMount={handleEditorWillMount}
                options={{
                  fontSize: 16,
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  fontLigatures: true,
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
      {/* --- NAVBAR --- */}
      <nav className="border-t border-white/10 px-8 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md fixed bottom-0 left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Code2 size={20} />
          </div>
          <span className="font-bold tracking-tight"></span>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all active:scale-95"
        >
          <Download size={18} />
          Export Image
        </button>
      </nav>
    </div>
  );
}