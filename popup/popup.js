// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');
    const wordCount = document.getElementById('wordCount');

    // Load initial state
    browser.storage.local.get('isEnabled', (result) => {
        toggle.checked = result.isEnabled !== undefined ? result.isEnabled : true;
    });

    // Update word count
    function updateWordCount() {
        browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { type: 'getWordCount' })
                .then(response => {
                    wordCount.textContent = `Words found: ${response.count}`;
                })
                .catch(() => {
                    wordCount.textContent = 'Words found: 0';
                });
        });
    }

    // Handle toggle changes
    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        browser.storage.local.set({ isEnabled });

        browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {
                type: 'toggle',
                isEnabled
            });
        });
    });

    // Update word count periodically
    updateWordCount();
    setInterval(updateWordCount, 1000);
}); 