import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layout } from './components/Layout';
import { INITIAL_TOPICS, MOCK_GEMINI_DATA } from './constants';
import { Topic, GeminiResponse, VisualizationType } from './types';
import { fetchConceptDetails } from './services/gemini';
import { Visualizer } from './components/Visualizer';
import { 
  Zap, 
  ArrowRight, 
  BookOpen, 
  Lightbulb, 
  GraduationCap, 
  ChevronLeft, 
  Loader2, 
  MousePointerClick, 
  Bookmark, 
  RotateCcw,
  Search,
  Activity,
  BatteryCharging,
  Lightbulb as LightbulbIcon,
  Cpu,
  Radio,
  Waves,
  Triangle,
  Network,
  Magnet,
  X,
  Youtube,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import katex from 'katex';

// --- Utility Components ---

const LatexRenderer: React.FC<{ formula: string }> = ({ formula }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          throwOnError: false,
          displayMode: true,
          output: 'html' 
        });
      } catch (e) {
        containerRef.current.innerText = formula;
      }
    }
  }, [formula]);

  return (
    <div 
      ref={containerRef} 
      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-blue-50 font-serif drop-shadow-lg py-4 px-2 overflow-x-auto overflow-y-hidden max-w-full flex justify-center items-center" 
    />
  );
};

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const FlipCard: React.FC<FlipCardProps> = ({ front, back, className = "", loading = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (loading) {
    return (
      <div className={`relative w-full h-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 ${className}`}>
        {front}
      </div>
    );
  }

  return (
    <div 
      className={`group perspective-1000 cursor-pointer ${className}`} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Face */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group-hover:border-blue-500/50 group-hover:shadow-blue-500/10 transition-all">
          <div className="h-full w-full">
            {front}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-slate-800/80 rounded-full border border-slate-700 backdrop-blur-sm text-xs text-blue-300 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
               <MousePointerClick className="w-3.5 h-3.5" /> <span>Tap to Flip</span>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-xl ring-1 ring-white/5">
          <div className="h-full w-full overflow-y-auto custom-scrollbar relative">
             <button 
                onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors z-10"
                title="Flip back"
             >
                <RotateCcw className="w-3.5 h-3.5" />
             </button>
             {back}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [aiData, setAiData] = useState<GeminiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [savedTopics, setSavedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('electroViz_saved');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (activeTopic) {
      loadTopicData(activeTopic.name);
    }
  }, [activeTopic]);

  const loadTopicData = async (topicName: string) => {
    setLoading(true);
    setAiData(null);
    setError(null);
    
    const data = await fetchConceptDetails(topicName);
    
    if (data) {
      setAiData(data);
    } else {
      setError("Failed to load AI content. Using offline mode.");
      setAiData(MOCK_GEMINI_DATA);
    }
    setLoading(false);
  };

  const handleTopicClick = (topic: Topic) => {
    setActiveTopic(topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRelatedClick = (topicName: string) => {
    // Check if topic exists in our predefined list to get correct icon/visualizer
    const existingTopic = INITIAL_TOPICS.find(t => t.name.toLowerCase() === topicName.toLowerCase());
    
    if (existingTopic) {
      handleTopicClick(existingTopic);
    } else {
      // Create a temporary topic for new concepts found via AI
      const newTopic: Topic = {
        id: topicName.toLowerCase().replace(/\s+/g, '-'),
        name: topicName,
        shortDescription: "Explore this related concept",
        icon: 'Zap',
        visType: VisualizationType.GENERIC
      };
      handleTopicClick(newTopic);
    }
  };

  const toggleSave = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    setSavedTopics(prev => {
      const newSaved = prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId];
      localStorage.setItem('electroViz_saved', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  // Helper to render correct icon based on string ID
  const renderIcon = (iconName: string, className: string) => {
    switch(iconName) {
      case 'Zap': return <Zap className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'BatteryCharging': return <BatteryCharging className={className} />;
      case 'Lightbulb': return <Lightbulb className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Radio': return <Radio className={className} />;
      case 'Waves': return <Waves className={className} />;
      case 'Triangle': return <Triangle className={className} />;
      case 'Network': return <Network className={className} />;
      case 'Magnet': return <Magnet className={className} />;
      default: return <Zap className={className} />;
    }
  };

  const filteredTopics = useMemo(() => {
    return INITIAL_TOPICS.filter(topic => 
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      topic.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderHome = () => (
    <div className="space-y-10 pb-12">
      <div className="text-center max-w-4xl mx-auto space-y-8 pt-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Master Electrical Engineering<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">One Concept at a Time</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Explore interactive visualizations and AI-powered explanations designed to make complex formulas intuitive.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-10 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-xl shadow-black/20"
            placeholder="Search topics (e.g., 'Maxwell', 'Power')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => {
            const isSaved = savedTopics.includes(topic.id);
            return (
              <div
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className="group relative flex flex-col p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10"></div>

                <div className="absolute top-6 right-6 z-10">
                  <button
                    onClick={(e) => toggleSave(e, topic.id)}
                    className={`p-2.5 rounded-full transition-all duration-300 active:scale-90 backdrop-blur-sm ${
                      isSaved 
                        ? 'bg-yellow-400/10 text-yellow-400 ring-1 ring-yellow-400/50' 
                        : 'bg-slate-800/50 text-slate-500 hover:text-slate-300 hover:bg-slate-700 ring-1 ring-slate-700'
                    }`}
                    title={isSaved ? "Remove from favorites" : "Save to favorites"}
                  >
                    <Bookmark className={`w-5 h-5 transition-transform duration-300 ${isSaved ? 'fill-yellow-400 scale-110' : 'scale-100'}`} />
                  </button>
                </div>
                
                <div className="w-14 h-14 mb-6 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white transition-all duration-300 shadow-lg">
                  {renderIcon(topic.icon, "w-7 h-7 text-blue-400 group-hover:text-white")}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-100 mb-3">{topic.name}</h3>
                <p className="text-slate-400 text-base leading-relaxed">{topic.shortDescription}</p>

                <div className="mt-auto pt-6 flex items-center text-blue-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Start Learning <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 mb-4">
                <Search className="w-8 h-8 opacity-50" />
             </div>
             <p className="text-lg font-medium">No topics found matching "{searchQuery}"</p>
             <button 
               onClick={() => setSearchQuery('')}
               className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
             >
               Clear search
             </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!activeTopic) return null;
    const isSaved = savedTopics.includes(activeTopic.id);

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 pb-12">
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => setActiveTopic(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium py-2 px-3 rounded-lg hover:bg-slate-800 w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Topics
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-slate-800/50 pb-8">
          <div className="space-y-4 max-w-3xl w-full">
            <div className="flex items-center justify-between md:justify-start gap-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {activeTopic.name}
              </h1>
              <button
                onClick={(e) => toggleSave(e, activeTopic.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 active:scale-95 font-medium ${
                  isSaved 
                    ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 transition-transform duration-300 ${isSaved ? 'fill-yellow-400 scale-110' : 'scale-100'}`} />
                {isSaved ? "Saved" : "Save"}
              </button>
            </div>
            
            {loading ? (
               <div className="flex items-center gap-3 text-blue-300 animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-lg">Consulting AI for the best explanation...</span>
               </div>
            ) : (
              <p className="text-xl text-slate-300 leading-relaxed font-light">
                 {aiData?.summary || activeTopic.shortDescription}
              </p>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Learning Content */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Formula Flip Card - Featured Large */}
            <div className="h-72 w-full">
              <FlipCard 
                loading={loading}
                className="h-full"
                front={
                  <div className="h-full flex flex-col items-center justify-center relative p-8 bg-gradient-to-br from-indigo-900/50 to-slate-900 border-none">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="p-5 bg-blue-500/20 rounded-2xl mb-6 ring-1 ring-blue-500/40 shadow-lg shadow-blue-900/20">
                       <BookOpen className="w-10 h-10 text-blue-300" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">The Formula</h3>
                    <p className="text-slate-400 font-medium">Tap to reveal the mathematics behind {activeTopic.name}</p>
                  </div>
                }
                back={
                  <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 bg-slate-900 text-center relative">
                     <h4 className="text-xs uppercase tracking-widest text-blue-400 mb-4 md:mb-8 font-bold opacity-80">Mathematical Representation</h4>
                     <div className="flex-grow flex items-center justify-center w-full overflow-hidden">
                        {aiData?.formula_latex && <LatexRenderer formula={aiData.formula_latex} />}
                     </div>
                     <p className="text-slate-500 text-xs md:text-sm mt-4 md:mt-6">
                        Variables are case-sensitive standard SI units.
                     </p>
                  </div>
                }
              />
            </div>

            {/* Analogy & Application Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Analogy Flip Card */}
              <div className="h-64">
                <FlipCard 
                  loading={loading}
                  className="h-full"
                  front={
                    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-900 hover:bg-slate-800/50 transition-colors">
                       <div className="p-4 bg-amber-500/10 rounded-full mb-4 ring-1 ring-amber-500/30">
                         <Lightbulb className="w-8 h-8 text-amber-400" />
                       </div>
                       <h3 className="text-xl font-bold text-slate-200">Analogy</h3>
                       <p className="text-slate-500 text-sm mt-2 text-center">Think about it simply</p>
                    </div>
                  }
                  back={
                    <div className="h-full flex flex-col p-8 bg-slate-800/80">
                      <h4 className="text-xs uppercase tracking-widest text-amber-400 mb-4 font-bold flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" /> Real World Analogy
                      </h4>
                      <div className="flex-grow flex items-center justify-center">
                         <p className="text-slate-200 text-lg leading-relaxed text-center font-medium">
                          "{aiData?.real_world_analogy}"
                        </p>
                      </div>
                    </div>
                  }
                />
              </div>

              {/* Application Flip Card */}
              <div className="h-64">
                <FlipCard 
                  loading={loading}
                  className="h-full"
                  front={
                    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-900 hover:bg-slate-800/50 transition-colors">
                       <div className="p-4 bg-emerald-500/10 rounded-full mb-4 ring-1 ring-emerald-500/30">
                         <GraduationCap className="w-8 h-8 text-emerald-400" />
                       </div>
                       <h3 className="text-xl font-bold text-slate-200">Application</h3>
                       <p className="text-slate-500 text-sm mt-2 text-center">In the real world</p>
                    </div>
                  }
                  back={
                    <div className="h-full flex flex-col p-8 bg-slate-800/80">
                       <h4 className="text-xs uppercase tracking-widest text-emerald-400 mb-4 font-bold flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> Practical Use
                      </h4>
                      <div className="flex-grow flex items-center justify-center">
                        <p className="text-slate-200 text-lg leading-relaxed text-center font-medium">
                          {aiData?.practical_application}
                        </p>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Fun Fact (Static Card) */}
            {!loading && aiData?.fun_fact && (
              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-6 flex items-start gap-5 shadow-inner">
                 <div className="p-3 bg-indigo-500/20 rounded-xl shrink-0 border border-indigo-500/20">
                    <Zap className="w-6 h-6 text-indigo-300" />
                 </div>
                 <div>
                    <h4 className="text-indigo-200 font-bold text-sm mb-2 tracking-wide uppercase">Did you know?</h4>
                    <p className="text-slate-300 text-base leading-relaxed">
                      {aiData.fun_fact}
                    </p>
                 </div>
              </div>
            )}

            {/* YouTube Resources */}
            {!loading && aiData?.youtube_queries && aiData.youtube_queries.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-500" />
                  Video Tutorials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {aiData.youtube_queries.map((video, idx) => (
                    <a 
                      key={idx}
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/30 hover:bg-slate-800 transition-all"
                    >
                      <div className="p-2.5 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                         <Youtube className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-slate-200 font-medium truncate group-hover:text-white">{video.title}</p>
                         <div className="flex items-center gap-2 mt-1">
                           <span className={`text-xs px-2 py-0.5 rounded-full border ${
                              video.language === 'Hindi' 
                                ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                           }`}>
                             {video.language}
                           </span>
                           <span className="text-xs text-slate-500 flex items-center gap-1 group-hover:text-slate-400">
                             Watch on YouTube <ExternalLink className="w-3 h-3" />
                           </span>
                         </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Interactive Visualizer & Related */}
          <div className="lg:col-span-5 space-y-8">
            <Visualizer type={activeTopic.visType} topicName={activeTopic.name} />

            {/* Related Concepts */}
            {!loading && aiData?.related_concepts && aiData.related_concepts.length > 0 && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <LinkIcon className="w-5 h-5 text-blue-400" /> Related Concepts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {aiData.related_concepts.map((concept, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRelatedClick(concept)}
                      className="px-4 py-2 bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 rounded-full text-sm text-slate-300 hover:text-white transition-all duration-300"
                    >
                      {concept}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  };

  return (
    <Layout onHome={() => setActiveTopic(null)}>
      {activeTopic ? renderDetail() : renderHome()}
    </Layout>
  );
};

export default App;