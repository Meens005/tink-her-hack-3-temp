// background.js
async function extractWebsiteNotes(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Create DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Advanced content extraction
      const title = doc.title || 'No Title';
      
      // Extract main content sections
      const contentSelectors = [
        'article', 
        '.content', 
        '#main-content', 
        '.main-content', 
        'main', 
        '.article-body'
      ];
      
      let mainContent = '';
      for (let selector of contentSelectors) {
        const contentElement = doc.querySelector(selector);
        if (contentElement) {
          mainContent = extractMainText(contentElement);
          break;
        }
      }
      
      // Fallback to paragraphs if no main content found
      if (!mainContent) {
        const paragraphs = Array.from(doc.querySelectorAll('p'))
          .slice(0, 10)
          .map(p => p.textContent.trim())
          .filter(text => text.length > 50)
          .join('\n\n');
        mainContent = paragraphs;
      }
      
      // Generate summary
      const summary = generateSummary(mainContent);
      
      return {
        title: title,
        mainContent: mainContent,
        summary: summary
      };
    } catch (error) {
      return {
        error: `Failed to extract notes: ${error.message}`
      };
    }
  }
  
  function extractMainText(element) {
    // Remove scripts, styles, and other non-content elements
    const elementsToRemove = element.querySelectorAll('script, style, nav, header, footer');
    elementsToRemove.forEach(el => el.remove());
    
    // Extract text from paragraphs
    const paragraphs = Array.from(element.querySelectorAll('p'))
      .map(p => p.textContent.trim())
      .filter(text => text.length > 50);
    
    return paragraphs.join('\n\n');
  }
  
  function generateSummary(text, maxLength = 300) {
    // Simple extractive summarization
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Select important sentences based on length
    const importantSentences = sentences
      .filter(sentence => sentence.length > 50)
      .slice(0, 3);
    
    return importantSentences.join('. ') + '.';
  }