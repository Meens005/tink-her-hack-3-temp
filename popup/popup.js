document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const generateBtn = document.getElementById('generateNotes');
    const notesArea = document.getElementById('notesArea');
  
    generateBtn.addEventListener('click', async function() {
      const url = urlInput.value.trim();
      if (!url) {
        notesArea.value = 'Please enter a valid URL';
        return;
      }
  
      try {
        const response = await fetch(url);
        const html = await response.text();
        
        // Simple parsing
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const title = doc.title || 'No Title';
        const paragraphs = Array.from(doc.querySelectorAll('p'))
          .slice(0, 5)
          .map(p => p.textContent.trim())
          .filter(text => text.length > 0)
          .join('\n\n');
  
        notesArea.value = `Title: ${title}\n\nContent:\n${paragraphs}`;
      } catch (error) {
        notesArea.value = `Error: ${error.message}`;
      }
    });
  });