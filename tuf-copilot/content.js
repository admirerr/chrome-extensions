// 1. Inject script to access Monaco Editor
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
script.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(script);

// 2. Create the Premium Vertical Tab
function createButton() {
    if (document.getElementById('tuf-copilot-btn')) return;
    if (!document.querySelector("h1[class*='title']")) return;

    const btn = document.createElement('button');
    btn.id = 'tuf-copilot-btn';
    
    // Sleek SVG icon + Text
    btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(90deg); margin-bottom: 4px;">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
        </svg>
        Analyze
    `;
    
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '0px',
        zIndex: '99999',
        padding: '14px 6px',
        backgroundColor: 'rgba(20, 20, 23, 0.9)', 
        color: '#e5e7eb', 
        border: '1px solid #374151',
        borderRight: 'none',
        borderRadius: '8px 0 0 8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backdropFilter: 'blur(8px)',
        boxShadow: '-4px 0px 12px rgba(0,0,0,0.3)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        WebkitFontSmoothing: 'antialiased'
    });

    btn.onmouseover = () => {
        btn.style.backgroundColor = '#10a37f';
        btn.style.borderColor = '#10a37f';
        btn.style.color = '#ffffff';
        btn.style.paddingRight = '12px';
    };
    btn.onmouseout = () => {
        btn.style.backgroundColor = 'rgba(20, 20, 23, 0.9)';
        btn.style.borderColor = '#374151';
        btn.style.color = '#e5e7eb';
        btn.style.paddingRight = '6px';
    };

    btn.addEventListener('click', handleAnalyzeClick);
    document.body.appendChild(btn);
}

// 3. Handle Click
async function handleAnalyzeClick() {
    const btn = document.getElementById('tuf-copilot-btn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '⏳...';

    try {
        // Detect if user forgot to refresh the page after updating the extension
        if (!chrome || !chrome.storage || !chrome.storage.local) {
            throw new Error("Extension connection lost. Please REFRESH this webpage (Press F5).");
        }

        const titleEl = document.querySelector("h1[class*='title']");
        const title = titleEl ? titleEl.innerText.trim() : "Unknown Problem";

        const contentEl = document.querySelector("div[class*='ProblemPanel-module'][class*='content']");
        const description = contentEl ? contentEl.innerText.trim() : "Description not found";

        // Request code and await response instantly (No more hardcoded 500ms delays)
        window.postMessage({ type: 'REQUEST_CODE' }, '*');
        const code = await new Promise(resolve => {
            const listener = (event) => {
                if (event.source !== window) return;
                if (event.data.type === 'RECEIVE_CODE') {
                    window.removeEventListener('message', listener);
                    clearTimeout(fallbackTimer);
                    resolve(event.data.code);
                }
            };
            window.addEventListener('message', listener);
            
            // Fallback just in case inject.js is blocked
            const fallbackTimer = setTimeout(() => {
                window.removeEventListener('message', listener);
                const lines = Array.from(document.querySelectorAll(".view-line"));
                const domCode = lines.map(l => l.textContent).join('\n');
                resolve(domCode || "// Code could not be fully extracted.");
            }, 300); 
        });

        const prompt = `Act as a strict, expert competitive programming coach. Your response MUST be extremely brief, direct, and contain zero fluff. Do NOT output any conversational text, greetings, or conclusions outside of this exact template. 
Keep sentences short. I am primarily interested in whether my code is optimal, its flaws, and the absolute best way to solve it.

--- EXACT FORMAT TEMPLATE TO FOLLOW ---
**Verdict**: [Optimal / Not Optimal / Buggy]. [1 brief sentence explaining why].

**Complexity**:
- Your Code: Time [O(...)], Space [O(...)]
- Optimal Code: Time [O(...)], Space [O(...)]

**Flaws & Bottlenecks in Your Code**:
- [Flaw 1 - max 15 words]
- [Flaw 2 - max 15 words]
- [Flaw 3 - max 15 words (if any)]

**The Optimal Approach**:
[2-3 concise sentences describing the absolute best algorithm or data structure to use for the most optimal solution]

**How to Overcome / Fix**:
- [Actionable step 1 to fix or rewrite the code]
- [Actionable step 2]
---------------------------------------

### Problem Title:
${title}

### Problem Description:
${description}

### My Code:
\`\`\`cpp
${code}
\`\`\`
`;

        // Copy to clipboard FIRST, while the takeuforward tab is still focused
        try {
            await navigator.clipboard.writeText(prompt);
        } catch (clipboardErr) {
            console.warn("Clipboard copy failed, but proceeding anyway:", clipboardErr);
        }

        // Save to storage and open ChatGPT LAST
        chrome.storage.local.set({ pendingTufPrompt: prompt }, () => {
            if (chrome.runtime.lastError) {
                throw new Error("Storage error: " + chrome.runtime.lastError.message);
            }
            window.open('https://chatgpt.com/', '_blank');
        });

    } catch (err) {
        console.error("TUF Copilot Error:", err);
        alert("Error: " + err.message);
    } finally {
        btn.innerHTML = originalHTML;
    }
}

setInterval(createButton, 1500);