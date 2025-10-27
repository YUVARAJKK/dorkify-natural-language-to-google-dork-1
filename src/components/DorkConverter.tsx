"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Copy, Check, Sparkles, ArrowRight, Zap } from "lucide-react";
import { convertToDork } from "@/lib/dork-converter";
import { toast } from "sonner";

export default function DorkConverter() {
  const [input, setInput] = useState("");
  const [dorkOutput, setDorkOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    
    setIsConverting(true);
    setTimeout(() => {
      const result = convertToDork(input);
      setDorkOutput(result);
      setIsConverting(false);
      toast.success("Dork query generated!");
    }, 300);
  };

  const handleSearchGoogle = () => {
    if (!dorkOutput) {
      toast.error("Generate a dork query first");
      return;
    }
    
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(dorkOutput)}`;
    
    // Handle iframe context
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: searchUrl } }, "*");
      toast.success("Opening in new tab...");
    } else {
      window.open(searchUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopy = async () => {
    if (!dorkOutput) {
      toast.error("No dork query to copy");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(dorkOutput);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const quickTemplates = [
    { label: "🔒 Login Pages", query: 'site:example.com inurl:login' },
    { label: "📄 PDF Files", query: 'filetype:pdf "confidential"' },
    { label: "📊 Excel Files", query: 'filetype:xls OR filetype:xlsx "financial"' },
    { label: "🗃️ Directory Listing", query: 'intitle:"index of" "parent directory"' },
    { label: "⚙️ Config Files", query: 'filetype:conf OR filetype:config OR filetype:cfg' },
    { label: "🔑 Password Files", query: 'filetype:txt intext:password' },
  ];

  const exampleQueries = [
    "Find PDF resumes for senior developers from 2024",
    "Find login pages on example.com",
    "Find Excel files with financial data",
    "Find admin panels on github.com",
    "Find exposed database backups"
  ];

  const handleExampleClick = (example: string) => {
    setInput(example);
    setDorkOutput("");
  };

  const handleTemplateClick = (query: string) => {
    setDorkOutput(query);
    toast.success("Template loaded!");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Quick Templates */}
      <div className="gradient-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Quick Templates</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickTemplates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => handleTemplateClick(template.query)}
              className="text-left px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 transition-all group"
            >
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {template.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Converter */}
      <div className="gradient-border p-8 space-y-6 glow-effect">
        {/* Input Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="natural-input" className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Your Search Intent
            </label>
            <div className="flex items-center gap-2 text-xs text-primary">
              <Sparkles className="w-3 h-3" />
              <span>Smart Conversion</span>
            </div>
          </div>
          <Textarea
            id="natural-input"
            placeholder='Describe what you want to find... (e.g., "Find PDF resumes for senior developers from 2024")'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleConvert();
              }
            }}
            className="min-h-[140px] bg-background/60 border-border/60 text-foreground placeholder:text-muted-foreground resize-none focus:border-primary/50 transition-colors text-lg"
          />
          
          {/* Example Queries */}
          {!input && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Try examples:</span>
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(example)}
                    className="text-xs px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Convert Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleConvert} 
            disabled={!input.trim() || isConverting}
            className="animated-gradient px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isConverting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Converting...
              </>
            ) : (
              <>
                Convert to Dork
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>

        {/* Output Section */}
        {dorkOutput && (
          <div className="space-y-4 pt-6 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Generated Google Dork
            </label>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-background/90 backdrop-blur-sm border border-primary/30 rounded-lg p-4">
                <code className="block text-lg font-mono text-foreground break-all leading-relaxed">
                  {dorkOutput}
                </code>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSearchGoogle}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                size="lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Search on Google
              </Button>
              
              <Button
                onClick={handleCopy}
                variant="outline"
                className="px-6 py-6 border-border/60 hover:border-primary/50 hover:bg-primary/5 rounded-lg transition-all"
                size="lg"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}