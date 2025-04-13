// Initialize extension state
let isEnabled = true;
let highlightedWords = new Set();

// Function to create tooltip element
function createTooltip(word, meaning) {
    const tooltip = document.createElement('div');
    tooltip.className = 'gre-tooltip';
    tooltip.textContent = meaning;
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '10000';
    tooltip.style.backgroundColor = 'white';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '3px';
    tooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    tooltip.style.maxWidth = '300px';
    tooltip.style.wordWrap = 'break-word';
    return tooltip;
}

// Function to highlight words
function highlightWords() {
    if (!isEnabled) return;

    const textNodes = document.evaluate(
        "//text()[not(ancestor::script) and not(ancestor::style)]",
        document.body,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    for (let i = 0; i < textNodes.snapshotLength; i++) {
        const node = textNodes.snapshotItem(i);
        const text = node.textContent;
        const words = text.split(/\b/);

        let newHTML = '';
        for (const word of words) {
            const lowerWord = word.toLowerCase();
            if (greWordList[lowerWord] && !highlightedWords.has(word)) {
                highlightedWords.add(word);
                newHTML += `<span class="gre-highlight" data-word="${word}" data-meaning="${greWordList[lowerWord]}">${word}</span>`;
            } else {
                newHTML += word;
            }
        }

        if (newHTML !== text) {
            const span = document.createElement('span');
            span.innerHTML = newHTML;
            node.parentNode.replaceChild(span, node);
        }
    }
}

// Function to handle tooltip events
function handleTooltipEvents() {
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('gre-highlight')) {
            const word = e.target.dataset.word;
            const meaning = e.target.dataset.meaning;
            if (meaning) {
                const tooltip = createTooltip(word, meaning);
                document.body.appendChild(tooltip);

                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

                e.target.addEventListener('mouseout', () => {
                    tooltip.remove();
                }, { once: true });
            }
        }
    });
}

// Initialize extension
function initialize() {
    // Load extension state from storage
    browser.storage.local.get('isEnabled', (result) => {
        isEnabled = result.isEnabled !== undefined ? result.isEnabled : true;
        if (isEnabled) {
            highlightWords();
            handleTooltipEvents();
        }
    });

    // Listen for state changes from popup
    browser.runtime.onMessage.addListener((message) => {
        if (message.type === 'toggle') {
            isEnabled = message.isEnabled;
            if (isEnabled) {
                highlightWords();
                handleTooltipEvents();
            } else {
                // Remove highlights
                document.querySelectorAll('.gre-highlight').forEach(el => {
                    el.replaceWith(el.textContent);
                });
                highlightedWords.clear();
            }
        } else if (message.type === 'getWordCount') {
            return Promise.resolve({ count: highlightedWords.size });
        }
    });
}

// Start initialization
initialize();

// Handle dynamic content changes
const observer = new MutationObserver((mutations) => {
    if (isEnabled) {
        highlightWords();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
}); 