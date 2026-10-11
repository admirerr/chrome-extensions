window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data.type === 'REQUEST_CODE') {
        let code = "";
        try {
            if (window.monaco && window.monaco.editor.getModels().length > 0) {
                code = window.monaco.editor.getModels()[0].getValue();
            }
        } catch(e) {
            console.error("Failed to extract code from Monaco:", e);
        }
        window.postMessage({ type: 'RECEIVE_CODE', code: code }, '*');
    }
});