import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-teal-500 blur-[100px] rounded-full mix-blend-screen animate-pulse-glow" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20">
            C
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CollabSpace</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/register" className="px-5 py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all backdrop-blur-sm">
            Sign up
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
        <div className="animate-slide-up max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            Real-time collaboration is here
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Write, plan, and build <br />
            <span className="text-gradient">together in real-time.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The premium collaborative workspace for modern teams. Experience seamless real-time editing, 
            instant presence, and a stunning interface designed for focus.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/register" 
              className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-teal-500 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
            >
              Get started for free
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 text-base font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
            >
              View demo
            </Link>
          </div>
        </div>

        {/* Mock Editor Preview */}
        <div className="mt-20 w-full max-w-5xl mx-auto relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e1a]/80 to-[#0a0e1a] z-10 h-full w-full pointer-events-none" />
          <div className="glass-panel rounded-t-2xl border-b-0 p-2 overflow-hidden shadow-2xl relative">
            <div className="flex items-center gap-2 mb-4 px-4 pt-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="bg-[#0a0e1a] rounded-lg p-8 border border-white/5 opacity-80 h-[300px]">
              <div className="w-3/4 h-8 bg-white/10 rounded-md mb-6"></div>
              <div className="w-full h-4 bg-white/5 rounded-md mb-3"></div>
              <div className="w-5/6 h-4 bg-white/5 rounded-md mb-3"></div>
              <div className="w-4/5 h-4 bg-white/5 rounded-md mb-8"></div>
              
              <div className="flex gap-4">
                <div className="w-1/3 h-24 bg-purple-500/10 border border-purple-500/20 rounded-lg"></div>
                <div className="w-1/3 h-24 bg-teal-500/10 border border-teal-500/20 rounded-lg"></div>
              </div>
            </div>
            
            {/* Fake cursor */}
            <div className="absolute top-[120px] left-[30%] z-20 animate-pulse">
              <div className="w-0.5 h-5 bg-teal-400 relative">
                <div className="absolute -top-6 -left-2 bg-teal-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                  Alice Smith
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
