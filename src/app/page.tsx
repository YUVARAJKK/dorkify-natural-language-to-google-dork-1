"use client";

import DorkConverter from "@/components/DorkConverter";
import DorkLibrary from "@/components/DorkLibrary";
import { Shield, Sparkles, Lock, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="relative border-b border-border/50 backdrop-blur-xl bg-card/30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Advanced Search Query Generator</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-gradient">Dorkify</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform plain English into powerful Google Dork queries instantly
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Security Research</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span>Advanced Search</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4 text-primary" />
                <span>Ethical Hacking</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:py-16">
        {/* Primary Tool Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Natural Language Converter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Describe what you're looking for in plain English, and we'll generate the perfect Google Dork query for you
            </p>
          </div>
          <DorkConverter />
        </div>

        {/* Secondary Section - Library */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Operator Reference Library
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master Google Dork operators to craft advanced search queries like a pro
            </p>
          </div>
          <DorkLibrary />
        </div>

        {/* Info Cards Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          <div className="gradient-border p-6 space-y-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Security Research
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Discover exposed files, vulnerable endpoints, and security misconfigurations across the web
            </p>
          </div>

          <div className="gradient-border p-6 space-y-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Lightning Fast
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Instant conversion from natural language to precise Google Dork syntax with smart pattern matching
            </p>
          </div>

          <div className="gradient-border p-6 space-y-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Learn & Master
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Comprehensive operator library with examples to help you become a Google Dorking expert
            </p>
          </div>
        </div>

        {/* What is Google Dorking */}
        <div className="max-w-4xl mx-auto">
          <div className="gradient-border p-8 space-y-4 glow-effect">
            <h3 className="text-2xl font-bold text-foreground">
              What is Google Dorking?
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Google Dorking (Google Hacking Database) is an advanced search technique that leverages specialized operators to uncover information that's difficult to find through standard searches. Security researchers, penetration testers, and information gatherers use these powerful queries to find specific file types, discover hidden pages, identify vulnerable systems, and locate exposed sensitive data across the internet.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              This tool bridges the gap between natural language and complex operator syntax, making advanced search capabilities accessible to everyone—from cybersecurity professionals to curious researchers.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              ⚠️ Use responsibly and ethically. Always respect privacy, follow legal guidelines, and obtain proper authorization before security testing.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Dorkify is an educational tool designed for legitimate security research and advanced search techniques.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}