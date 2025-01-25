// content.js
function extractYouTubeNotes() {
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.content;
    
    // Extract video transcript (simplified)
    const transcriptElements = document.querySelectorAll('.ytd-transcript-segment');
    const transcript = Array.from(transcriptElements)
      .map(el => el.textContent)
      .join('\n');
  
    return `Title: ${title}\n\nDescription: ${description}\n\nTranscript Highlights:\n${transcript}`;
  }
  
  function extractWebsiteNotes() {
    const title = document.title;
    const paragraphs = Array.from(document.querySelectorAll('p'))
      .slice(0, 5)  // Limit to first 5 paragraphs
      .map(p => p.textContent)
      .join('\n\n');
  
    return `Title: ${title}\n\nKey Paragraphs:\n${paragraphs}`;
  }
  
  function generateNotes() {
    let notes = '';
    
    // Detect page type
    if (window.location.href.includes('youtube.com')) {
      notes = extractYouTubeNotes();
    } else {
      notes = extractWebsiteNotes();
    }
  
    // Save notes to storage
    chrome.storage.local.set({generatedNotes: notes}, function() {
      console.log('Notes saved');
    });
  }