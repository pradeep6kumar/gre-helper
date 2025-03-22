# GRE Word Helper

A Firefox extension that highlights GRE words on webpages and shows their meanings when you hover over them.

## Features

- Automatically scans webpages for GRE words
- Highlights GRE words with a yellow background
- Shows the meaning of a word when you hover over it
- Toggle highlighting on/off with a simple switch
- Manually trigger a scan of the current page

## Installation

### Temporary Installation (for Development)

1. Open Firefox and navigate to `about:debugging`
2. Click on "This Firefox" in the left sidebar
3. Click on "Load Temporary Add-on..."
4. Navigate to the `gre-helper` folder and select the `manifest.json` file
5. The extension should now be installed and active

### Permanent Installation

To create a permanent installation:

1. Zip the contents of the `gre-helper` folder
2. Rename the zip file to `gre-helper.xpi`
3. Open Firefox and navigate to `about:addons`
4. Click the gear icon and select "Install Add-on From File..."
5. Select the `gre-helper.xpi` file
6. Follow the prompts to complete the installation

## Usage

1. After installation, you'll see the GRE Word Helper icon in your browser toolbar
2. Click the icon to open the popup
3. Use the toggle switch to enable/disable highlighting
4. Click the "Scan Page Now" button to manually trigger a scan of the current page
5. Hover over highlighted words to see their meanings

## Customization

You can customize the extension by modifying the following files:

- `js/content.js`: Change the highlighting style or tooltip appearance
- `popup/popup.html`: Modify the popup UI
- `js/wordlist.js`: Update the GRE word list

## Building from Source

To build the extension from source:

1. Make sure you have Python installed
2. Run `python convert_wordlist_to_js.py` to convert the GRE wordlist to a JavaScript file
3. Run `python icons/create_icons.py` to generate the icons
4. The extension is now ready to use

## License

This project is licensed under the MIT License - see the LICENSE file for details. 