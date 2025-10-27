export function convertToDork(input: string): string {
  if (!input.trim()) return "";

  let dork = input.toLowerCase().trim();
  
  // Pattern matching for common queries - Enhanced with more GHDB patterns
  const patterns = [
    // Resumes/CVs
    {
      regex: /find\s+(resumes?|cvs?)\s+for\s+(.+?)\s+(?:in|from)\s+(\d{4})/i,
      handler: (match: RegExpMatchArray) => {
        const role = match[2];
        const year = match[3];
        return `filetype:pdf (resume OR cv) "${role}" ${year}`;
      }
    },
    {
      regex: /find\s+(resumes?|cvs?)\s+for\s+(.+)/i,
      handler: (match: RegExpMatchArray) => {
        const role = match[2];
        return `filetype:pdf (resume OR cv) "${role}"`;
      }
    },
    
    // Database Files
    {
      regex: /find\s+(?:exposed|vulnerable)?\s*database\s+(?:backups?|dumps?)/i,
      handler: () => {
        return 'filetype:sql "INSERT INTO" OR filetype:db "database"';
      }
    },
    {
      regex: /find\s+sql\s+(?:files?|backups?)/i,
      handler: () => {
        return 'filetype:sql intext:"INSERT INTO" OR intext:"CREATE TABLE"';
      }
    },
    
    // Configuration Files
    {
      regex: /find\s+(?:config|configuration)\s+files?/i,
      handler: () => {
        return 'filetype:conf OR filetype:config OR filetype:cfg OR filetype:ini';
      }
    },
    {
      regex: /find\s+(?:environment|env)\s+files?/i,
      handler: () => {
        return 'filetype:env "DB_PASSWORD" OR "API_KEY" OR "SECRET"';
      }
    },
    
    // Log Files
    {
      regex: /find\s+(?:exposed|public)?\s*log\s+files?/i,
      handler: () => {
        return 'filetype:log OR intitle:"index of" logs';
      }
    },
    
    // Admin Panels & Login Pages
    {
      regex: /find\s+(?:admin|administrator)\s+(?:panel|page|interface|dashboard)s?\s+(?:on|for)\s+(\S+)/i,
      handler: (match: RegExpMatchArray) => {
        const site = match[1];
        return `site:${site} (inurl:admin OR inurl:administrator OR inurl:cpanel)`;
      }
    },
    {
      regex: /find\s+login\s+pages?\s+(?:on|for)\s+(\S+)/i,
      handler: (match: RegExpMatchArray) => {
        const site = match[1];
        return `site:${site} (inurl:login OR inurl:signin OR intitle:login)`;
      }
    },
    
    // WordPress Specific
    {
      regex: /find\s+wordpress\s+(?:admin|login|sites?)/i,
      handler: () => {
        return 'inurl:"wp-admin" OR inurl:"wp-login" OR intitle:"WordPress"';
      }
    },
    
    // phpMyAdmin
    {
      regex: /find\s+phpmyadmin/i,
      handler: () => {
        return 'inurl:"/phpmyadmin" intitle:"phpMyAdmin"';
      }
    },
    
    // Webcams & Cameras
    {
      regex: /find\s+(?:exposed|open|public)?\s*(?:webcams?|cameras?)/i,
      handler: () => {
        return 'intitle:"webcam 7" OR intitle:"network camera" OR inurl:"view/view.shtml"';
      }
    },
    
    // Directory Listings
    {
      regex: /find\s+(?:index|directories|directory\s+listing)s?\s+(?:of|with|containing)?\s*(.+)/i,
      handler: (match: RegExpMatchArray) => {
        const type = match[1] || "files";
        return `intitle:"index of" "${type}"`;
      }
    },
    {
      regex: /find\s+(?:open|exposed)\s+directories/i,
      handler: () => {
        return 'intitle:"index of" "parent directory"';
      }
    },
    
    // Error Pages & SQL Errors
    {
      regex: /find\s+sql\s+errors?/i,
      handler: () => {
        return 'intext:"sql syntax near" OR intext:"mysql_fetch" OR intext:"ORA-00921"';
      }
    },
    {
      regex: /find\s+(?:php|server)\s+errors?/i,
      handler: () => {
        return 'intext:"Warning: mysql_" OR intext:"Fatal error:" OR intext:"Parse error:"';
      }
    },
    
    // Sensitive Documents
    {
      regex: /find\s+(?:confidential|sensitive|private)\s+(?:documents?|files?)/i,
      handler: () => {
        return 'filetype:pdf (confidential OR "not for distribution" OR "internal only")';
      }
    },
    {
      regex: /find\s+(?:password|credential)s?\s+files?/i,
      handler: () => {
        return 'filetype:txt intext:password OR filetype:xls password';
      }
    },
    
    // Specific Vulnerabilities
    {
      regex: /find\s+vulnerable\s+(?:sites?|pages?)\s+(?:to|with)\s+(.+)/i,
      handler: (match: RegExpMatchArray) => {
        const vuln = match[1];
        return `inurl:"${vuln}" OR intext:"${vuln}"`;
      }
    },
    
    // Email Lists
    {
      regex: /find\s+emails?\s+(?:at|from|on)\s+(\S+)/i,
      handler: (match: RegExpMatchArray) => {
        const site = match[1];
        return `site:${site} "@${site}" OR site:${site} "email" OR "contact"`;
      }
    },
    
    // PDFs on a site
    {
      regex: /find\s+pdfs?\s+on\s+(\S+)\s+about\s+(.+)/i,
      handler: (match: RegExpMatchArray) => {
        const site = match[1];
        const topic = match[2];
        return `site:${site} filetype:pdf "${topic}"`;
      }
    },
    {
      regex: /find\s+pdfs?\s+about\s+(.+)\s+on\s+(\S+)/i,
      handler: (match: RegExpMatchArray) => {
        const topic = match[1];
        const site = match[2];
        return `site:${site} filetype:pdf "${topic}"`;
      }
    },
    {
      regex: /find\s+pdfs?\s+(?:about|containing|with)\s+(.+)/i,
      handler: (match: RegExpMatchArray) => {
        const topic = match[1];
        return `filetype:pdf "${topic}"`;
      }
    },
    
    // Specific file type searches with topics
    {
      regex: /find\s+(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)\s+(?:files?\s+)?(?:about|containing|with)\s+(.+)/i,
      handler: (match: RegExpMatchArray) => {
        const filetype = match[1];
        const topic = match[2];
        return `filetype:${filetype} "${topic}"`;
      }
    },
    {
      regex: /find\s+(excel|word|powerpoint)\s+(?:files?\s+)?(?:about|containing|with)\s+(.+)/i,
      handler: (match: RegExpMatchArray) => {
        const type = match[1].toLowerCase();
        const topic = match[2];
        const ext = type === 'excel' ? 'xls OR filetype:xlsx' : 
                    type === 'word' ? 'doc OR filetype:docx' : 
                    'ppt OR filetype:pptx';
        return `(filetype:${ext}) "${topic}"`;
      }
    },
    
    // Site-specific searches
    {
      regex: /(?:search|find)\s+(?:on|in)\s+(\S+)\s+for\s+(.+)/i,
      handler: (match: RegExpMatchArray) => {
        const site = match[1];
        const query = match[2];
        return `site:${site} "${query}"`;
      }
    },
    {
      regex: /(?:search|find)\s+(.+)\s+(?:on|in)\s+(\S+)/i,
      handler: (match: RegExpMatchArray) => {
        const query = match[1];
        const site = match[2];
        return `site:${site} "${query}"`;
      }
    },
    
    // Title searches
    {
      regex: /find\s+pages?\s+with\s+(?:title|titled)\s+(.+)/i,
      handler: (match: RegExpMatchArray) => {
        const title = match[1];
        return `intitle:"${title}"`;
      }
    },
    
    // URL searches
    {
      regex: /find\s+(?:pages?|urls?)\s+containing\s+(.+)\s+in\s+(?:the\s+)?url/i,
      handler: (match: RegExpMatchArray) => {
        const term = match[1];
        return `inurl:${term}`;
      }
    },
    
    // Exclude terms
    {
      regex: /find\s+(.+)\s+(?:but\s+not|exclude|excluding|without)\s+(.+)/i,
      handler: (match: RegExpMatchArray) => {
        const include = match[1];
        const exclude = match[2];
        return `"${include}" -${exclude}`;
      }
    },
    
    // Date ranges
    {
      regex: /find\s+(.+)\s+(?:from|between)\s+(\d{4})\s+(?:to|and)\s+(\d{4})/i,
      handler: (match: RegExpMatchArray) => {
        const query = match[1];
        const startYear = match[2];
        const endYear = match[3];
        return `"${query}" ${startYear}..${endYear}`;
      }
    },
    
    // Year-specific
    {
      regex: /find\s+(.+)\s+(?:in|from)\s+(\d{4})/i,
      handler: (match: RegExpMatchArray) => {
        const query = match[1];
        const year = match[2];
        return `"${query}" ${year}`;
      }
    },
    
    // API Keys & Secrets
    {
      regex: /find\s+(?:api\s+keys?|secrets?|tokens?)/i,
      handler: () => {
        return 'filetype:env "API_KEY" OR filetype:json "api_key" OR "secret_key"';
      }
    },
    
    // Git & Version Control
    {
      regex: /find\s+(?:git|github)\s+(?:repos?|repositories)/i,
      handler: () => {
        return 'inurl:".git" OR intitle:"Index of /.git"';
      }
    },
  ];

  // Try to match against patterns
  for (const pattern of patterns) {
    const match = input.match(pattern.regex);
    if (match) {
      return pattern.handler(match);
    }
  }

  // Fallback: basic conversion
  // Convert common words to operators
  dork = dork.replace(/\b(?:search for|find|look for|get)\s+/gi, "");
  
  // If it's a simple phrase, wrap it in quotes
  if (!dork.includes(":") && !dork.includes("-") && !dork.includes('"')) {
    return `"${input.trim()}"`;
  }

  return input.trim();
}