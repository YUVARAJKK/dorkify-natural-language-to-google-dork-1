export function convertToDork(input: string): string {
  if (!input.trim()) return "";

  let dork = input.trim();
  
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

  // ENHANCED FALLBACK: Smart conversion with multiple passes
  let result = dork.toLowerCase();
  let operators: string[] = [];
  let searchTerms: string[] = [];
  let hasOperator = false;
  
  // Remove common filler words but preserve the query intent
  result = result.replace(/\b(?:please|can you|could you|i want to|i need to|help me)\s+/gi, "");
  result = result.replace(/\b(?:search for|find|look for|get me|show me|display|locate)\s+/gi, "");
  
  // 1. Extract file types
  const fileTypeMap: Record<string, string> = {
    'pdf': 'pdf', 'pdfs': 'pdf',
    'doc': 'doc', 'docs': 'doc', 'word': 'doc',
    'docx': 'docx',
    'xls': 'xls', 'excel': 'xls', 'spreadsheet': 'xls',
    'xlsx': 'xlsx',
    'ppt': 'ppt', 'powerpoint': 'ppt', 'presentation': 'ppt',
    'pptx': 'pptx',
    'txt': 'txt', 'text file': 'txt', 'text files': 'txt',
    'csv': 'csv',
    'sql': 'sql', 'database': 'sql',
    'log': 'log', 'logs': 'log',
    'xml': 'xml',
    'json': 'json',
    'conf': 'conf', 'config': 'conf', 'configuration': 'conf',
    'env': 'env', 'environment': 'env',
    'ini': 'ini',
    'cfg': 'cfg',
    'db': 'db',
    'bak': 'bak', 'backup': 'bak', 'backups': 'bak'
  };
  
  for (const [keyword, ext] of Object.entries(fileTypeMap)) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    if (regex.test(result)) {
      operators.push(`filetype:${ext}`);
      result = result.replace(regex, '').trim();
      hasOperator = true;
    }
  }
  
  // 2. Extract site/domain
  const siteMatch = result.match(/\b(?:on|from|at|in)\s+([a-z0-9-]+\.(?:com|org|net|edu|gov|io|co|uk|de|fr|jp|cn|in|au|ca))\b/i);
  if (siteMatch) {
    operators.push(`site:${siteMatch[1]}`);
    result = result.replace(siteMatch[0], '').trim();
    hasOperator = true;
  } else {
    // Check for domain without preposition
    const domainMatch = result.match(/\b([a-z0-9-]+\.(?:com|org|net|edu|gov|io|co|uk|de|fr|jp|cn|in|au|ca))\b/i);
    if (domainMatch) {
      operators.push(`site:${domainMatch[1]}`);
      result = result.replace(domainMatch[0], '').trim();
      hasOperator = true;
    }
  }
  
  // 3. Extract URL patterns
  const urlKeywords = ['login', 'admin', 'administrator', 'cpanel', 'dashboard', 'panel', 'signin', 'signup', 'register'];
  for (const keyword of urlKeywords) {
    const regex = new RegExp(`\\b${keyword}\\s+(?:page|pages|panel|interface)?\\b`, 'gi');
    if (regex.test(result)) {
      operators.push(`inurl:${keyword}`);
      result = result.replace(regex, '').trim();
      hasOperator = true;
    }
  }
  
  // 4. Extract title patterns
  const titleMatch = result.match(/\b(?:titled?|title|heading)\s+["']?([^"']+)["']?/i);
  if (titleMatch) {
    operators.push(`intitle:"${titleMatch[1].trim()}"`);
    result = result.replace(titleMatch[0], '').trim();
    hasOperator = true;
  }
  
  // 5. Detect special content types
  const contentPatterns: Record<string, string> = {
    'password': 'intext:password',
    'passwords': 'intext:password',
    'api key': 'intext:"api_key" OR intext:"apikey"',
    'api keys': 'intext:"api_key" OR intext:"apikey"',
    'secret': 'intext:secret',
    'secrets': 'intext:secret',
    'token': 'intext:token',
    'tokens': 'intext:token',
    'credential': 'intext:credential',
    'credentials': 'intext:credential',
    'username': 'intext:username',
    'email': 'intext:email OR intext:"@"',
    'emails': 'intext:email OR intext:"@"'
  };
  
  for (const [keyword, operator] of Object.entries(contentPatterns)) {
    const regex = new RegExp(`\\b${keyword}s?\\b`, 'gi');
    if (regex.test(result)) {
      operators.push(operator);
      result = result.replace(regex, '').trim();
      hasOperator = true;
    }
  }
  
  // 6. Detect directory listings
  if (/\b(?:directory|directories|index|folder|folders)\b/i.test(result)) {
    operators.push('intitle:"index of"');
    result = result.replace(/\b(?:directory|directories|index|folder|folders|listing|listings)\b/gi, '').trim();
    hasOperator = true;
  }
  
  // 7. Detect vulnerability/exposed/public keywords
  if (/\b(?:vulnerable|exposed|public|open|unsecured)\b/i.test(result)) {
    result = result.replace(/\b(?:vulnerable|exposed|public|open|unsecured)\b/gi, '').trim();
  }
  
  // 8. Detect years and date ranges
  const yearMatch = result.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    searchTerms.push(yearMatch[0]);
    result = result.replace(yearMatch[0], '').trim();
  }
  
  // 9. Extract quoted phrases (preserve user quotes)
  const quotedPhrases = result.match(/"[^"]+"/g);
  if (quotedPhrases) {
    searchTerms.push(...quotedPhrases);
    result = result.replace(/"[^"]+"/g, '').trim();
  }
  
  // 10. Handle remaining words as search terms
  if (result.length > 0) {
    // Clean up extra spaces and common words
    result = result.replace(/\b(?:the|a|an|and|or|with|for|about|containing|that|this|these|those)\b/gi, ' ');
    result = result.replace(/\s+/g, ' ').trim();
    
    if (result.length > 0) {
      // If it's a multi-word phrase, quote it
      if (result.includes(' ')) {
        searchTerms.push(`"${result}"`);
      } else {
        searchTerms.push(result);
      }
    }
  }
  
  // 11. Construct final dork query
  let finalDork = '';
  
  if (operators.length > 0 || searchTerms.length > 0) {
    // Combine operators and search terms
    const parts = [...operators, ...searchTerms];
    finalDork = parts.join(' ').trim();
  }
  
  // If we still have nothing meaningful, return the original with better formatting
  if (!finalDork || finalDork.length === 0) {
    // Clean the original input
    const cleaned = dork.replace(/\b(?:please|can you|could you|i want to|i need to|help me|search for|find|look for|get me|show me)\s+/gi, '').trim();
    
    // If it's a simple phrase without operators, wrap in quotes
    if (!cleaned.includes(':') && !cleaned.includes('-') && !cleaned.includes('"')) {
      return `"${cleaned}"`;
    }
    return cleaned;
  }
  
  return finalDork;
}