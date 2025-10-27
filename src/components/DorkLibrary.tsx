"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Code2, FileSearch, Copy, Search, Filter, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface DorkOperator {
  operator: string;
  description: string;
  example: string;
  category: string;
  usage: string;
}

const dorkOperators: DorkOperator[] = [
  // Domain & Site Operators
  {
    operator: "site:",
    description: "Limits results to those from a specific website or domain",
    example: 'site:github.com "machine learning"',
    category: "Domain",
    usage: "site:example.com"
  },
  {
    operator: "related:",
    description: "Finds sites related to a given domain",
    example: 'related:nytimes.com',
    category: "Domain",
    usage: "related:example.com"
  },
  {
    operator: "link:",
    description: "Finds pages that link to a specific URL",
    example: 'link:example.com',
    category: "Domain",
    usage: "link:example.com"
  },
  
  // File Type Operators
  {
    operator: "filetype:",
    description: "Searches for specific file types (pdf, doc, xls, ppt, etc.)",
    example: 'filetype:pdf "annual report"',
    category: "File",
    usage: "filetype:pdf"
  },
  {
    operator: "ext:",
    description: "Alternative to filetype: - searches for file extensions",
    example: 'ext:sql "database backup"',
    category: "File",
    usage: "ext:sql"
  },
  
  // Title Operators
  {
    operator: "intitle:",
    description: "Searches for pages with specific words in the title",
    example: 'intitle:"index of" passwords',
    category: "Title",
    usage: 'intitle:"keyword"'
  },
  {
    operator: "allintitle:",
    description: "All query words must appear in the page title",
    example: 'allintitle:security camera login',
    category: "Title",
    usage: "allintitle:word1 word2"
  },
  
  // URL Operators
  {
    operator: "inurl:",
    description: "Searches for pages with specific words in the URL",
    example: 'inurl:admin login',
    category: "URL",
    usage: "inurl:admin"
  },
  {
    operator: "allinurl:",
    description: "All query words must appear in the URL",
    example: 'allinurl:admin panel config',
    category: "URL",
    usage: "allinurl:word1 word2"
  },
  
  // Content Operators
  {
    operator: "intext:",
    description: "Searches for pages containing specific text in the body",
    example: 'intext:"confidential" filetype:pdf',
    category: "Content",
    usage: 'intext:"keyword"'
  },
  {
    operator: "allintext:",
    description: "All query words must appear in the page text",
    example: 'allintext:username password email',
    category: "Content",
    usage: "allintext:word1 word2"
  },
  {
    operator: "inanchor:",
    description: "Searches for pages with specific words in anchor text",
    example: 'inanchor:"click here"',
    category: "Content",
    usage: 'inanchor:"text"'
  },
  {
    operator: "allinanchor:",
    description: "All query words must appear in anchor text of links",
    example: 'allinanchor:best practices security',
    category: "Content",
    usage: "allinanchor:word1 word2"
  },
  
  // Cache & Special
  {
    operator: "cache:",
    description: "Shows Google's cached version of a page",
    example: 'cache:example.com',
    category: "Special",
    usage: "cache:example.com"
  },
  {
    operator: "info:",
    description: "Displays information about a page",
    example: 'info:example.com',
    category: "Special",
    usage: "info:example.com"
  },
  {
    operator: "define:",
    description: "Shows definitions of a word or phrase",
    example: 'define:phishing',
    category: "Special",
    usage: "define:word"
  },
  
  // Modifiers
  {
    operator: "-",
    description: "Excludes results containing the specified term",
    example: 'python programming -snake',
    category: "Modifier",
    usage: "-excludeword"
  },
  {
    operator: '"..."',
    description: "Searches for exact phrase match",
    example: '"machine learning engineer"',
    category: "Modifier",
    usage: '"exact phrase"'
  },
  {
    operator: "*",
    description: "Wildcard for any word or phrase",
    example: '"best * framework 2024"',
    category: "Modifier",
    usage: '"word * word"'
  },
  {
    operator: "+",
    description: "Forces inclusion of common words Google might ignore",
    example: '+the +best practices',
    category: "Modifier",
    usage: "+word"
  },
  
  // Logic Operators
  {
    operator: "OR",
    description: "Searches for either term (use uppercase OR)",
    example: 'javascript OR typescript tutorial',
    category: "Logic",
    usage: "term1 OR term2"
  },
  {
    operator: "AND",
    description: "Searches for both terms (implicit by default)",
    example: 'security AND encryption',
    category: "Logic",
    usage: "term1 AND term2"
  },
  {
    operator: "|",
    description: "Alternative OR operator using pipe symbol",
    example: 'react | vue | angular',
    category: "Logic",
    usage: "term1 | term2"
  },
  
  // Range Operators
  {
    operator: "..",
    description: "Searches within a number range",
    example: 'laptop $500..$1000',
    category: "Range",
    usage: "number1..number2"
  },
  {
    operator: "AROUND(n)",
    description: "Finds words within n words of each other",
    example: 'security AROUND(3) breach',
    category: "Range",
    usage: "word1 AROUND(5) word2"
  },
  
  // Advanced Security Dorks
  {
    operator: 'intitle:"index of"',
    description: "Finds directory listings that expose files",
    example: 'intitle:"index of" "backup"',
    category: "Security",
    usage: 'intitle:"index of" folder'
  },
  {
    operator: 'inurl:"/admin"',
    description: "Finds admin panels and login pages",
    example: 'inurl:"/admin" intitle:login',
    category: "Security",
    usage: 'inurl:"/admin"'
  },
  {
    operator: 'inurl:"wp-admin"',
    description: "Finds WordPress admin pages",
    example: 'inurl:"wp-admin" inurl:"wp-login"',
    category: "Security",
    usage: 'inurl:"wp-admin"'
  },
  {
    operator: 'inurl:"/phpmyadmin"',
    description: "Finds exposed phpMyAdmin installations",
    example: 'inurl:"/phpmyadmin" intitle:"phpMyAdmin"',
    category: "Security",
    usage: 'inurl:"/phpmyadmin"'
  },
  {
    operator: 'filetype:env',
    description: "Finds exposed environment configuration files",
    example: 'filetype:env "DB_PASSWORD"',
    category: "Security",
    usage: 'filetype:env'
  },
  {
    operator: 'filetype:log',
    description: "Finds exposed log files that may contain sensitive data",
    example: 'filetype:log inurl:"/logs/"',
    category: "Security",
    usage: 'filetype:log'
  },
  {
    operator: 'intext:"sql syntax"',
    description: "Finds pages with SQL errors that may indicate vulnerabilities",
    example: 'intext:"sql syntax near" OR intext:"syntax error has occurred"',
    category: "Security",
    usage: 'intext:"error message"'
  },
  {
    operator: 'intitle:"webcam"',
    description: "Finds exposed webcams and surveillance systems",
    example: 'intitle:"webcam 7" OR intitle:"network camera"',
    category: "Security",
    usage: 'intitle:"webcam"'
  },
];

const categoryIcons: Record<string, string> = {
  Domain: "🌐",
  File: "📄",
  Title: "📰",
  URL: "🔗",
  Content: "📝",
  Special: "⚡",
  Modifier: "🔧",
  Logic: "🧩",
  Range: "📊",
  Security: "🔒"
};

const categoryColors: Record<string, string> = {
  Domain: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  File: "bg-green-500/10 text-green-400 border-green-500/20",
  Title: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  URL: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Content: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Special: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Modifier: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Logic: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Range: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  Security: "bg-red-500/10 text-red-400 border-red-500/20"
};

export default function DorkLibrary() {
  const [selectedOperator, setSelectedOperator] = useState<DorkOperator | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["all", ...Array.from(new Set(dorkOperators.map(op => op.category)))];
  
  const filteredOperators = dorkOperators.filter(op => {
    const matchesCategory = filterCategory === "all" || op.category === filterCategory;
    const matchesSearch = op.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         op.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOperatorSelect = (value: string) => {
    const operator = dorkOperators.find(op => op.operator === value);
    setSelectedOperator(operator || null);
  };

  const handleCopyOperator = async () => {
    if (selectedOperator) {
      await navigator.clipboard.writeText(selectedOperator.operator);
      toast.success("Operator copied!");
    }
  };

  const handleCopyExample = async () => {
    if (selectedOperator) {
      await navigator.clipboard.writeText(selectedOperator.example);
      toast.success("Example copied!");
    }
  };

  const handleSearchExample = () => {
    if (selectedOperator) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(selectedOperator.example)}`;
      const isInIframe = window.self !== window.top;
      if (isInIframe) {
        window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: searchUrl } }, "*");
      } else {
        window.open(searchUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="gradient-border p-8 space-y-6 glow-effect">
        <div className="flex items-center justify-between pb-2 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Operator Library</h3>
              <p className="text-sm text-muted-foreground">Master the Google Hacking Database</p>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary text-base px-4 py-1">
            {dorkOperators.length} Operators
          </Badge>
        </div>

        {/* Search and Filter */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Search Operators
            </label>
            <div className="relative">
              <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/60 border-border/60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Filter by Category
            </label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-background/60 border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-border/60">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="cursor-pointer">
                    {cat === "all" ? "All Categories" : `${categoryIcons[cat]} ${cat}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Operator Selection */}
        <div className="space-y-3">
          <label htmlFor="operator-select" className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Select an Operator ({filteredOperators.length})
          </label>
          <Select onValueChange={handleOperatorSelect}>
            <SelectTrigger 
              id="operator-select" 
              className="bg-background/60 border-border/60 h-12 text-base focus:border-primary/50 transition-colors"
            >
              <SelectValue placeholder="Choose a Google Dork operator to learn more..." />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-border/60 max-h-[400px]">
              {filteredOperators.map((op) => (
                <SelectItem 
                  key={op.operator} 
                  value={op.operator}
                  className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{categoryIcons[op.category]}</span>
                    <span className="font-mono font-bold text-primary">{op.operator}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground text-sm">{op.category}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedOperator ? (
          <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Operator Header */}
            <div className="flex items-start gap-4">
              <div className="text-5xl">{categoryIcons[selectedOperator.category]}</div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-mono text-3xl font-bold text-primary">
                    {selectedOperator.operator}
                  </h3>
                  <Badge className={`${categoryColors[selectedOperator.category]} border text-sm px-3 py-1`}>
                    {selectedOperator.category}
                  </Badge>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {selectedOperator.description}
                </p>
              </div>
            </div>

            {/* Usage Pattern */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                <Code2 className="w-4 h-4 text-primary" />
                <span>Usage Pattern</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-primary/5 rounded-lg blur-lg opacity-50" />
                <div className="relative bg-background/90 backdrop-blur-sm border border-primary/20 rounded-lg p-4 flex items-center justify-between">
                  <code className="text-base font-mono text-foreground">
                    {selectedOperator.usage}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyOperator}
                    className="hover:bg-primary/10"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Example */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Example Query</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-xl opacity-50" />
                <div className="relative bg-background/90 backdrop-blur-sm border border-primary/30 rounded-lg p-5 space-y-3">
                  <code className="block text-base font-mono text-foreground break-all leading-relaxed">
                    {selectedOperator.example}
                  </code>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSearchExample}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Try on Google
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyExample}
                      className="border-border/60 hover:border-primary/50"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-muted/30">
              <FileSearch className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-base">
                Select an operator from the dropdown to explore its functionality
              </p>
              <p className="text-muted-foreground/70 text-sm">
                {filteredOperators.length} operators available
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}