import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = () => {

  
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  // ✅ Generate code
  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    // Check if API key exists at the time of function call
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return toast.error("Gemini API key is missing. Please check your .env file.");
    }

    try {
      setLoading(true);
      
      // Initialize the AI inside the function to avoid browser issues
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const result = await model.generateContent(`
        You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

        Now, generate a UI component for: ${prompt}  
        Framework to use: ${frameWork.value}  

        Requirements:  
        - The code must be clean, well-structured, and easy to understand.  
        - Optimize for SEO where applicable.  
        - Focus on creating a modern, animated, and responsive UI design.  
        - Include high-quality hover effects, shadows, animations, colors, and typography.  
        - Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
        - Do NOT include explanations, text, comments, or anything else besides the code.  
        - And give the whole code in a single HTML file.
      `);

      const response = await result.response;
      const generatedCode = extractCode(response.text());
      
      if (generatedCode) {
        setCode(generatedCode);
        setOutputScreen(true);
        toast.success("Code generated successfully!");
      } else {
        toast.error("Failed to generate code. Please try again.");
      }

    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // More specific error handling
      if (error.message?.includes('API_KEY_INVALID')) {
        toast.error("Invalid API key. Please check your Gemini API key.");
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        toast.error("API quota exceeded. Please try again later.");
      } else if (error.message?.includes('SAFETY')) {
        toast.error("Request blocked by safety filters. Please modify your prompt.");
      } else {
        toast.error("Something went wrong while generating code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ✅ Copy Code
  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  // ✅ Download Code
  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/html' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded successfully!");
  };

  return (
    <>
      <Navbar />

      {/* ✅ Better responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16">
        {/* Left Section */}
        <div className="w-full py-6 rounded-xl bg-[#141319] mt-5 p-5">
          <h3 className='text-[25px] font-semibold sp-text'>AI Component Generator</h3>
          <p className='text-gray-400 mt-2 text-[16px]'>Describe your component and let AI code it for you.</p>

          <p className='text-[15px] font-[700] mt-4'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            value={frameWork}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#111",
                borderColor: "#333",
                color: "#fff",
                boxShadow: "none",
                "&:hover": { borderColor: "#555" }
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#111",
                color: "#fff"
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#333"
                  : state.isFocused
                    ? "#222"
                    : "#111",
                color: "#fff",
                "&:active": { backgroundColor: "#444" }
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "#aaa" }),
              input: (base) => ({ ...base, color: "#fff" })
            }}
            onChange={(selected) => setFrameWork(selected)}
          />

          <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className='w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none'
            placeholder="Describe your component in detail and AI will generate it..."
          ></textarea>

          <div className="flex items-center justify-between mt-3">
            <p className='text-gray-400 text-sm'>
              {!import.meta.env.VITE_GEMINI_API_KEY ? 
                "⚠️ API key missing - check .env file" : 
                "Click on generate button to get your code"
              }
            </p>
            <button
              onClick={getResponse}
              disabled={loading || !import.meta.env.VITE_GEMINI_API_KEY}
              className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <ClipLoader color='white' size={18} /> : <BsStars />}
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative mt-2 w-full h-[80vh] bg-[#141319] rounded-xl overflow-hidden">
          {
            !outputScreen ? (
              <div className="w-full h-full flex items-center flex-col justify-center">
                <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
                  <HiOutlineCode />
                </div>
                <p className='text-[16px] text-gray-400 mt-3'>Your component & code will appear here.</p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="bg-[#17171C] w-full h-[50px] flex items-center gap-3 px-3">
                  <button
                    onClick={() => setTab(1)}
                    className={`w-1/2 py-2 rounded-lg transition-all ${tab === 1 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setTab(2)}
                    className={`w-1/2 py-2 rounded-lg transition-all ${tab === 2 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                  >
                    Preview
                  </button>
                </div>

                {/* Toolbar */}
                <div className="bg-[#17171C] w-full h-[50px] flex items-center justify-between px-4">
                  <p className='font-bold text-gray-200'>Code Editor</p>
                  <div className="flex items-center gap-2">
                    {tab === 1 ? (
                      <>
                        <button 
                          onClick={copyCode} 
                          className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors"
                          title="Copy code"
                        >
                          <IoCopy />
                        </button>
                        <button 
                          onClick={downnloadFile} 
                          className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors"
                          title="Download file"
                        >
                          <PiExportBold />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => setIsNewTabOpen(true)} 
                          className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors"
                          title="Open fullscreen"
                        >
                          <ImNewTab />
                        </button>
                        <button 
                          onClick={() => setRefreshKey(prev => prev + 1)} 
                          className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors"
                          title="Refresh preview"
                        >
                          <FiRefreshCcw />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Editor / Preview */}
                <div className="h-full">
                  {tab === 1 ? (
                    <Editor 
                      value={code} 
                      height="100%" 
                      theme='vs-dark' 
                      language="html"
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        wordWrap: 'on'
                      }}
                    />
                  ) : (
                    <iframe 
                      key={refreshKey} 
                      srcDoc={code} 
                      className="w-full h-full bg-white text-black"
                      title="Component Preview"
                    />
                  )}
                </div>
              </>
            )
          }
        </div>
      </div>

      {/* ✅ Fullscreen Preview Overlay */}
      {isNewTabOpen && (
        <div className="fixed inset-0 bg-white w-screen h-screen overflow-auto z-50">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100 border-b">
            <p className='font-bold'>Preview - Fullscreen</p>
            <button 
              onClick={() => setIsNewTabOpen(false)} 
              className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
              title="Close fullscreen"
            >
              <IoCloseSharp />
            </button>
          </div>
          <iframe 
            srcDoc={code} 
            className="w-full h-[calc(100vh-60px)]"
            title="Component Preview Fullscreen"
          />
        </div>
      )}
    </>
  )
}

export default Home