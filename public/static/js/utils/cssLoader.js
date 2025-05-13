const styleCache = new Map();

export async function StyleLoader(shadowRoot, ...stylePaths) {
    try {
        const styleSheets = [];
        
        for (const path of stylePaths) {
            if (!styleCache.has(path)) {
                const response = await fetch(path);
                const cssText = await response.text();
                const styleSheet = new CSSStyleSheet();
                styleSheet.replaceSync(cssText);
                styleCache.set(path, styleSheet);
            }
            styleSheets.push(styleCache.get(path));
        }
        
        shadowRoot.adoptedStyleSheets = styleSheets;
        return true;
    } catch (error) {
        return false;
    }
}

export async function StyleLoaderStatic(...stylePaths) {
    try {
        const styleSheets = [];
        
        for (const path of stylePaths) {
            if (!styleCache.has(path)) {
                const response = await fetch(path);
                const cssText = await response.text();
                const styleSheet = new CSSStyleSheet();
                styleSheet.replaceSync(cssText);
                styleCache.set(path, styleSheet);
            }
            styleSheets.push(styleCache.get(path));
        }
        
        return styleSheets;
    } catch (error) {
        return false;
    }
}