export async function clearDOM(shadowRoot) {
    while (shadowRoot.firstChild) {
        shadowRoot.removeChild(shadowRoot.firstChild);
    }
}



