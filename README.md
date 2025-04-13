# GRE Word Helper Firefox Extension

A Firefox extension that helps users learn GRE vocabulary by highlighting words on web pages and showing their meanings in tooltips, without modifying the original page content.

## Features

- 🔍 Scans web pages for GRE vocabulary words
- 🖍️ Highlights matching words with a yellow background
- 💡 Shows word meanings in tooltips on hover
- 🔄 Allows users to enable/disable highlighting
- 📊 Displays a count of GRE words found on the page
- 🛡️ Preserves original page content

## Installation

### Prerequisites

1. Firefox browser
2. ImageMagick (for icon conversion)
   - Download from: https://imagemagick.org/script/download.php
   - Install with default settings

### Setup Steps

1. Clone this repository
2. Navigate to the project directory
3. Run the icon conversion script:
   ```powershell
   cd icons
   powershell -ExecutionPolicy Bypass -File convert_icons.ps1
   ```
4. Load the extension in Firefox:
   - Open Firefox and navigate to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the project directory

## Project Structure

```
gre-helper/
├── css/
│   └── tooltip.css          # Tooltip styling
├── icons/
│   ├── icon.svg             # Source icon
│   ├── convert_icons.ps1    # Icon conversion script
│   ├── icon-19.png          # 19x19 icon
│   ├── icon-38.png          # 38x38 icon
│   ├── icon-48.png          # 48x48 icon
│   └── icon-96.png          # 96x96 icon
├── js/
│   ├── wordlist.js          # GRE vocabulary dictionary
│   └── content.js           # Content script for highlighting
├── popup/
│   ├── popup.html           # Popup interface
│   └── popup.js             # Popup functionality
└── manifest.json            # Extension configuration
```

## Technical Implementation

### Core Components

1. **Content Script (`js/content.js`)**
   - Scans web pages for GRE vocabulary words
   - Implements word highlighting
   - Manages tooltip display
   - Handles dynamic content updates

2. **Popup Interface (`popup/`)**
   - Toggle for enabling/disabling highlighting
   - Word count display
   - State persistence using browser storage

3. **Word List (`js/wordlist.js`)**
   - Contains GRE vocabulary dictionary
   - Critical dependency for extension functionality

### Key Features

- **Non-intrusive Highlighting**: Uses CSS for highlighting without modifying original content
- **Dynamic Content Support**: Handles dynamically loaded content through MutationObserver
- **State Persistence**: Saves user preferences using browser storage
- **Responsive UI**: Clean and intuitive popup interface
- **Error Handling**: Graceful fallbacks for various scenarios

## Usage

1. Click the extension icon in Firefox to open the popup
2. Toggle the switch to enable/disable word highlighting
3. Hover over highlighted words to see their meanings
4. The word count updates automatically as you browse

## Development

### Requirements

- Firefox browser
- ImageMagick for icon conversion
- Basic understanding of web extension development

### Building

1. Ensure all required files are in place
2. Run the icon conversion script
3. Load the extension in Firefox for testing

### Testing

1. Load the extension in Firefox
2. Visit various websites to test word highlighting
3. Verify tooltip functionality
4. Test the enable/disable toggle
5. Check word count accuracy

## Error Handling

The extension includes error handling for:
- Content script failures
- Popup communication issues
- Storage access problems
- Word list loading errors
- Icon file operations

## Self-Verification

The extension performs self-verification for:
- Word highlighting functionality
- Tooltip positioning and visibility
- Extension state persistence
- Highlight cleanup
- Word list loading
- Original content preservation
- Icon file presence and sizing
- Directory structure
- File locations
- File permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Firefox Extension API documentation
- ImageMagick for icon conversion
- GRE vocabulary resources 