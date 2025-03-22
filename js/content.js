// GRE Word Helper - Content Script

// Global variables
let isEnabled = true;
let highlightedNodes = [];
let isScanning = false; // Flag to prevent recursive scanning

// Load the tooltip CSS
function loadTooltipCSS() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = browser.runtime.getURL('css/tooltip.css');
  document.head.appendChild(link);
}

// Function to check if extension is enabled
function checkIfEnabled() {
  browser.storage.local.get('enabled').then((result) => {
    isEnabled = result.enabled !== undefined ? result.enabled : true;
    if (isEnabled) {
      scanPage();
    } else {
      removeHighlights();
    }
  });
}

// Function to scan the page for GRE words
function scanPage() {
  if (!isEnabled || isScanning) return;
  
  isScanning = true; // Set scanning flag
  
  // Remove any existing highlights
  removeHighlights();
  
  // Get all text nodes in the body
  const textNodes = getTextNodes(document.body);
  
  // Process each text node
  textNodes.forEach((node) => {
    processTextNode(node);
  });
  
  // Notify about the updated word count
  notifyWordCount();
  
  isScanning = false; // Reset scanning flag
}

// Function to get all text nodes in an element
function getTextNodes(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip script and style elements
        if (node.parentNode.tagName === 'SCRIPT' || 
            node.parentNode.tagName === 'STYLE' ||
            node.parentNode.tagName === 'NOSCRIPT' ||
            node.parentNode.className.includes('gre-tooltip')) {
          return NodeFilter.FILTER_REJECT;
        }
        // Accept non-empty text nodes
        return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    },
    false
  );
  
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }
  
  return textNodes;
}

// Function to process a text node and highlight GRE words
function processTextNode(node) {
  const text = node.textContent;
  const words = text.match(/\b[a-zA-Z]{3,}\b/g);
  
  if (!words) return;
  
  // Check each word against the GRE wordlist
  const matches = [];
  words.forEach((word) => {
    const lowerWord = word.toLowerCase();
    if (greWordList[lowerWord]) {
      matches.push({
        word: word,
        meaning: greWordList[lowerWord]
      });
    }
  });
  
  if (matches.length === 0) return;
  
  // Replace the text node with highlighted words
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  
  matches.forEach((match) => {
    const regex = new RegExp(`\\b${match.word}\\b`, 'i');
    const matchIndex = text.toLowerCase().search(regex);
    
    if (matchIndex === -1) return;
    
    // Add text before the match
    if (matchIndex > lastIndex) {
      fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)));
    }
    
    // Create the highlighted span
    const span = document.createElement('span');
    span.className = 'gre-highlighted-word';
    span.textContent = text.substr(matchIndex, match.word.length);
    span.dataset.greMeaning = match.meaning;
    
    // Add event listeners for tooltip
    span.addEventListener('mouseenter', showTooltip);
    span.addEventListener('mouseleave', hideTooltip);
    
    fragment.appendChild(span);
    
    lastIndex = matchIndex + match.word.length;
    
    // Track the highlighted node
    highlightedNodes.push(span);
  });
  
  // Add any remaining text
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
  }
  
  // Replace the original node with the fragment
  if (fragment.childNodes.length > 0) {
    node.parentNode.replaceChild(fragment, node);
  }
}

// Function to show tooltip
function showTooltip(event) {
  const span = event.target;
  const meaning = span.dataset.greMeaning;
  
  // Create tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'gre-tooltip';
  tooltip.textContent = meaning;
  
  // Add tooltip to the span
  span.appendChild(tooltip);
  
  // Check if tooltip is going off-screen
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  
  // If tooltip is going off the left edge
  if (tooltipRect.left < 0) {
    tooltip.style.left = '0';
    tooltip.style.transform = 'translateX(0)';
  }
  
  // If tooltip is going off the right edge
  if (tooltipRect.right > viewportWidth) {
    tooltip.style.left = 'auto';
    tooltip.style.right = '0';
    tooltip.style.transform = 'translateX(0)';
  }
  
  // If tooltip is too close to the top of the viewport
  if (tooltipRect.top < 10) {
    tooltip.style.bottom = 'auto';
    tooltip.style.top = '125%';
    
    // Flip the arrow to point up
    tooltip.style.setProperty('--arrow-direction', 'up');
  }
}

// Function to hide tooltip
function hideTooltip(event) {
  const span = event.target;
  const tooltip = span.querySelector('.gre-tooltip');
  if (tooltip) {
    span.removeChild(tooltip);
  }
}

// Function to remove all highlights
function removeHighlights() {
  highlightedNodes.forEach((node) => {
    if (node.parentNode) {
      const text = document.createTextNode(node.textContent);
      node.parentNode.replaceChild(text, node);
    }
  });
  
  highlightedNodes = [];
}

// Function to notify about the word count
function notifyWordCount() {
  browser.runtime.sendMessage({
    action: 'wordCountUpdated',
    count: highlightedNodes.length
  }).catch(error => {
    // Ignore errors when popup is not open
    console.log("Word count notification sent");
  });
}

// Listen for messages from the popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggle') {
    isEnabled = message.enabled;
    if (isEnabled) {
      scanPage();
    } else {
      removeHighlights();
    }
  } else if (message.action === 'scan') {
    scanPage();
  } else if (message.action === 'getWordCount') {
    // Return the count of highlighted words
    sendResponse({ count: highlightedNodes.length });
    return true; // Required for asynchronous sendResponse
  }
});

// Initialize
loadTooltipCSS();
checkIfEnabled();

// Re-scan when the page is fully loaded
window.addEventListener('load', scanPage);

// Re-scan when the DOM is modified (with debounce and filtering)
let debounceTimer;
const observer = new MutationObserver((mutations) => {
  // Skip if we're currently scanning
  if (isScanning) return;
  
  // Check if mutations are only related to our highlights
  const shouldProcess = mutations.some(mutation => {
    // Skip mutations that only affect our highlighted elements or tooltips
    if (mutation.target.classList && 
        (mutation.target.classList.contains('gre-highlighted-word') || 
         mutation.target.classList.contains('gre-tooltip'))) {
      return false;
    }
    
    // Skip if all added nodes are our highlights or tooltips
    if (mutation.addedNodes.length > 0) {
      let allOurNodes = true;
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (!node.classList || 
              !(node.classList.contains('gre-highlighted-word') || 
                node.classList.contains('gre-tooltip'))) {
            allOurNodes = false;
          }
        }
      });
      if (allOurNodes) return false;
    }
    
    return true;
  });
  
  if (shouldProcess) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(scanPage, 1000);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
}); 