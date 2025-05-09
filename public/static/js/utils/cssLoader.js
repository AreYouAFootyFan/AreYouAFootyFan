export async function StyleLoader(shadowRoot, ...stylePaths) {
    try {
        const styleSheets = [];
        
        for (const path of stylePaths) {
            const response = await fetch(path);
            const cssText = await response.text();
            const styleSheet = new CSSStyleSheet();
            styleSheet.replaceSync(cssText);
            styleSheets.push(styleSheet);
        }
        
        shadowRoot.adoptedStyleSheets = styleSheets;
        return true;
    } catch (error) {
        console.error('Error loading styles:', error);
        return false;
    }
}