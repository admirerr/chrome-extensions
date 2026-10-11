window.addEventListener('load', () => {
    // Check if there is a pending prompt waiting in storage
    chrome.storage.local.get(['pendingTufPrompt'], (result) => {
        if (!result.pendingTufPrompt) return;
        
        const promptText = result.pendingTufPrompt;
        
        // Clear it from storage so it doesn't paste again if you refresh the page
        chrome.storage.local.remove('pendingTufPrompt');

        // --- RELEASE UI: Add a sleek Toast Notification ---
        const toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', color: '#fff', padding: '10px 24px',
            borderRadius: '20px', zIndex: '999999', fontSize: '14px', fontWeight: '500',
            fontFamily: 'system-ui, sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease', backdropFilter: 'blur(8px)', textAlign: 'center'
        });
        toast.innerText = '✨ TUF Copilot: Auto-pasting...';
        document.body.appendChild(toast);

        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            
            const chatInput = document.querySelector('div[contenteditable="true"].ProseMirror') || document.querySelector('textarea#prompt-textarea');
            
            if (chatInput) {
                clearInterval(checkInterval);
                chatInput.focus();

                if (chatInput.tagName.toLowerCase() === 'div') {
                    document.execCommand('insertText', false, promptText);
                } else {
                    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                    nativeSetter.call(chatInput, promptText);
                    chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                }

                let clickAttempts = 0;
                const clickInterval = setInterval(() => {
                    clickAttempts++;
                    const sendButton = document.querySelector('button[data-testid="send-button"]');
                    
                    // If button is active, click it!
                    if (sendButton && !sendButton.hasAttribute('disabled')) {
                        clearInterval(clickInterval);
                        setTimeout(() => {
                            sendButton.click();
                            // Update toast to success state
                            toast.innerText = '✅ Analysis requested!';
                            toast.style.backgroundColor = '#10a37f';
                            setTimeout(() => toast.style.opacity = '0', 2000);
                            setTimeout(() => toast.remove(), 2500);
                        }, 100);
                    } 
                    // INCREASED LIMIT: Wait up to 7 seconds (35 attempts * 200ms) for UI to load
                    else if (clickAttempts > 35) {
                        clearInterval(clickInterval);
                        
                        chatInput.dispatchEvent(new KeyboardEvent('keydown', {
                            bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13
                        }));
                        
                        toast.innerText = '⚠️ Taking longer than usual. Press Enter to send.';
                        toast.style.backgroundColor = '#eab308'; // Warning yellow
                        setTimeout(() => toast.style.opacity = '0', 4000);
                        setTimeout(() => toast.remove(), 4500);
                    }
                }, 200); 
            }

            // FALLBACK MECHANISM: If ChatGPT UI changes and text box isn't found
            if (attempts > 20) {
                clearInterval(checkInterval);
                toast.innerText = '⚠️ ChatGPT UI updated! Please press Ctrl+V / Cmd+V to paste your code.';
                toast.style.backgroundColor = '#ef4444'; // Red error color
                setTimeout(() => toast.style.opacity = '0', 6000);
                setTimeout(() => toast.remove(), 6500);
            }
        }, 500); 
    });
});