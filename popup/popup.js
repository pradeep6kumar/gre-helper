// GRE Word Helper - Popup Script

// DOM elements
const enableToggle = document.getElementById('enableToggle');
const scanButton = document.getElementById('scanButton');
const wordCountElement = document.getElementById('wordCount');

// Track if we're waiting for a word count update
let waitingForCount = false;

// Function to update the UI based on the current state
function updateUI(enabled) {
  enableToggle.checked = enabled;
}

// Function to get the current tab
async function getCurrentTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

// Function to toggle the extension
async function toggleExtension() {
  const enabled = enableToggle.checked;
  
  // Save the state
  await browser.storage.local.set({ enabled });
  
  // Send message to content script
  const tab = await getCurrentTab();
  browser.tabs.sendMessage(tab.id, { action: 'toggle', enabled });
  
  // Update word count after toggling
  if (enabled) {
    wordCountElement.textContent = "Counting...";
    waitingForCount = true;
  } else {
    wordCountElement.textContent = "0";
    waitingForCount = false;
  }
}

// Function to scan the page
async function scanPage() {
  wordCountElement.textContent = "Scanning...";
  waitingForCount = true;
  
  const tab = await getCurrentTab();
  browser.tabs.sendMessage(tab.id, { action: 'scan' });
}

// Function to update word count
async function updateWordCount() {
  if (waitingForCount) return; // Don't request if we're already waiting
  
  try {
    waitingForCount = true;
    wordCountElement.textContent = "Counting...";
    
    const tab = await getCurrentTab();
    
    // Request the count from the content script
    const response = await browser.tabs.sendMessage(tab.id, { action: 'getWordCount' });
    
    if (response && response.count !== undefined) {
      wordCountElement.textContent = response.count;
    } else {
      wordCountElement.textContent = "0";
    }
  } catch (error) {
    console.error("Error getting word count:", error);
    wordCountElement.textContent = "0";
  } finally {
    waitingForCount = false;
  }
}

// Listen for word count updates from content script
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'wordCountUpdated') {
    wordCountElement.textContent = message.count;
    waitingForCount = false;
  }
});

// Initialize the popup
async function initPopup() {
  // Get the current state
  const result = await browser.storage.local.get('enabled');
  const enabled = result.enabled !== undefined ? result.enabled : true;
  
  // Update the UI
  updateUI(enabled);
  
  // Update word count
  if (enabled) {
    updateWordCount();
  } else {
    wordCountElement.textContent = "0";
  }
}

// Event listeners
enableToggle.addEventListener('change', toggleExtension);
scanButton.addEventListener('click', scanPage);

// Initialize the popup when it's opened
document.addEventListener('DOMContentLoaded', initPopup); 