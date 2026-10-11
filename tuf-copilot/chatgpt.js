window.addEventListener('load', () => {
    // Check if there is a pending prompt waiting in storage
    chrome.storage.local.get(['pendingTufPrompt'], (result) => {
        if (!result.pendingTufPrompt) return;
        
        const promptText = result.pendingTufPrompt;
        
        // Clear it from storage so it doesn't paste again if you refresh the page
        chrome.storage.local.remove('pendingTufPrompt');

        // --- ULTRA-PREMIUM GLASSY TOAST NOTIFICATION ---
        const toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed', 
            top: '24px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(15, 15, 20, 0.4)', // Highly transparent base
            color: '#ffffff', 
            border: '1px solid rgba(255, 255, 255, 0.18)', // Crisp, reflective glass edge
            padding: '12px 24px',
            borderRadius: '16px', 
            zIndex: '999999', 
            fontSize: '14px', 
            fontWeight: '500',
            fontFamily: 'system-ui, -apple-system, sans-serif', 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)', 
            backdropFilter: 'blur(16px) saturate(180%)', // Intense frost + vivid colors behind it
            WebkitBackdropFilter: 'blur(16px) saturate(180%)', 
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        });
        toast.innerHTML = '✨ <span style="letter-spacing: 0.3px;">TUF Copilot: Auto-pasting...</span>';
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
                            
                            // 🟢 SUCCESS GLASS STATE
                            toast.innerHTML = '✅ <span>Analysis requested!</span>';
                            toast.style.backgroundColor = 'rgba(16, 163, 127, 0.35)'; // High transparency green
                            toast.style.borderColor = 'rgba(16, 163, 127, 0.5)';
                            toast.style.boxShadow = '0 8px 32px rgba(16, 163, 127, 0.25)'; // Green glow
                            
                            setTimeout(() => {
                                toast.style.opacity = '0';
                                toast.style.transform = 'translate(-50%, -10px)'; 
                            }, 2000);
                            setTimeout(() => toast.remove(), 2500);
                        }, 100);
                    } 
                    // Wait up to 7 seconds for UI to load
                    else if (clickAttempts > 35) {
                        clearInterval(clickInterval);
                        
                        chatInput.dispatchEvent(new KeyboardEvent('keydown', {
                            bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13
                        }));
                        
                        // 🟡 WARNING GLASS STATE
                        toast.innerHTML = '⏳ <span>Taking longer than usual. Press Enter to send.</span>';
                        toast.style.backgroundColor = 'rgba(234, 179, 8, 0.35)'; // High transparency yellow
                        toast.style.borderColor = 'rgba(234, 179, 8, 0.5)';
                        toast.style.boxShadow = '0 8px 32px rgba(234, 179, 8, 0.25)'; // Yellow glow
                        
                        setTimeout(() => {
                            toast.style.opacity = '0';
                            toast.style.transform = 'translate(-50%, -10px)';
                        }, 4000);
                        setTimeout(() => toast.remove(), 4500);
                    }
                }, 200); 
            }

            // FALLBACK MECHANISM
            if (attempts > 20) {
                clearInterval(checkInterval);
                
                // 🔴 ERROR GLASS STATE
                toast.innerHTML = '⚠️ <span>ChatGPT UI updated! Please press Ctrl+V to paste.</span>';
                toast.style.backgroundColor = 'rgba(239, 68, 68, 0.35)'; // High transparency red
                toast.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                toast.style.boxShadow = '0 8px 32px rgba(239, 68, 68, 0.25)'; // Red glow
                
                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translate(-50%, -10px)';
                }, 6000);
                setTimeout(() => toast.remove(), 6500);
            }
        }, 500); 
    });
});