(function(){
  if(document.getElementById('bigoasis-panel')) return;

  let isTransparent = false;

  // Problem counter for caring messages
  let problemsSolved = 0;
  const CARING_MESSAGE_INTERVAL = 3; // Show caring message every 3 problems

  // Load problem counter from storage
  async function loadProblemCounter() {
    try {
      if (chrome && chrome.storage && chrome.storage.local) {
        const result = await new Promise((resolve, reject) => {
          chrome.storage.local.get(['bigOasisProblemsSolved'], (result) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(result);
            }
          });
        });
        problemsSolved = result.bigOasisProblemsSolved || 0;
      }
    } catch (error) {
      console.warn('BigOasis: Failed to load problem counter:', error);
      problemsSolved = 0;
    }
  }

  // Sound effects system
  const soundEffects = {
    // Create audio context for web audio API
    audioContext: null,
    enabled: true,

    // Initialize audio context
    init() {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn('BigOasis: Audio not supported');
        this.enabled = false;
      }
    },

    // Create and play a tone
    playTone(frequency, duration, type = 'sine', volume = 0.1) {
      if (!this.enabled || !this.audioContext) return;

      try {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
      } catch (error) {
        console.warn('BigOasis: Sound playback failed:', error);
      }
    },

    // Play success sound (optimal solution)
    playSuccess() {
      // Ascending chord: C - E - G
      this.playTone(523.25, 0.2, 'sine', 0.1); // C5
      setTimeout(() => this.playTone(659.25, 0.2, 'sine', 0.1), 100); // E5
      setTimeout(() => this.playTone(783.99, 0.3, 'sine', 0.12), 200); // G5
    },

    // Play gentle chime (caring message)
    playChime() {
      // Soft bell-like sound
      this.playTone(880, 0.5, 'sine', 0.06); // A5
      setTimeout(() => this.playTone(1174.66, 0.4, 'sine', 0.04), 200); // D6
    },

    // Play achievement fanfare (milestones)
    playAchievement() {
      // Triumphant sequence
      this.playTone(523.25, 0.15, 'square', 0.08); // C5
      setTimeout(() => this.playTone(659.25, 0.15, 'square', 0.08), 120); // E5
      setTimeout(() => this.playTone(783.99, 0.15, 'square', 0.08), 240); // G5
      setTimeout(() => this.playTone(1046.50, 0.4, 'square', 0.1), 360); // C6
    },

    // Play notification sound (analysis complete)
    playNotification() {
      // Quick two-tone notification
      this.playTone(800, 0.1, 'sine', 0.05);
      setTimeout(() => this.playTone(1000, 0.15, 'sine', 0.06), 100);
    },

    // Play easter egg sound (special surprise)
    playEasterEgg() {
      // Playful ascending scale
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.50];
      notes.forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 0.1, 'triangle', 0.04), i * 50);
      });
    },

    // Toggle sound on/off
    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  };

  // Save problem counter to storage
  async function saveProblemCounter() {
    try {
      if (chrome && chrome.storage && chrome.storage.local) {
        await new Promise((resolve, reject) => {
          chrome.storage.local.set({ bigOasisProblemsSolved: problemsSolved }, () => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve();
            }
          });
        });
      }
    } catch (error) {
      console.warn('BigOasis: Failed to save problem counter:', error);
    }
  }

  // Increment problem counter and check if caring message should be shown
  async function incrementProblemCounter() {
    problemsSolved++;
    await saveProblemCounter();
    return (problemsSolved % CARING_MESSAGE_INTERVAL === 0);
  }

  // Caring messages for developers (shown every 3 problems)
  const caringMessages = [
    "🌟 3 problems done! Thak gaye hoge? Thoda paani peelo! 💧",
    "💙 3 problems complete! Gharwalo se baat kari? They miss you! 📞",
    "🫂 3 problems solved! Sab sahi ho jayega, bas patience rakho ✨", 
    "☕ 3 problems down! Coffee break lelo, tumhara dimag fresh ho jayega!",
    "🌸 3 problems finished! Hard work kar rahe ho, but self-care bhi zaroori hai 💕",
    "🤗 3 problems complete! Mom ko call karo, unki awaaz sunke achha lagega",
    "🍎 3 problems done! Kuch healthy khaya hai aaj? Body ko fuel chahiye!",
    "😊 3 problems solved! Smile kar lo, you're doing amazing! 🌟",
    "🛌 3 problems complete! Neend poori li thi? Sleep = better code!",
    "🌈 3 problems done! Mushkil waqt hai, but you're stronger than you think!",
    "💪 3 problems finished! Code se break lo, 5 min walk karo outside",
    "🎵 3 problems complete! Favorite song sun lo, mood fresh ho jayega",
    "🧘 3 problems solved! Deep breath lo... in... out... better feel kar rahe ho?",
    "📚 3 problems done! Roz kuch naya seekh rahe ho, proud feel karo!",
    "🌻 3 problems complete! Progress slow lage toh bhi, you're moving forward!",
    "💝 3 problems finished! Self-love is important too, be kind to yourself",
    "🚀 3 problems solved! Dream big kar rahe ho, universe tumhara saath dega!",
    "🌙 3 problems done! Late night coding? Eyes ko rest do kabhi kabhi",
    "🤝 3 problems complete! Help chahiye toh dosto se poocho, sharing is caring!",
    "✨ 3 problems finished! Every solution is making you a better developer!"
  ];

  // Easter egg messages for fun (rare but delightful)
  const easterEggMessages = [
    "🐛 No bugs found in your logic! (Unlike my code 😅)",
    "🔥 This solution is so clean, Marie Kondo would be proud!",
    "💻 Even Linus Torvalds would approve of this complexity!",
    "🎯 Optimal solution! You're basically the Neo of algorithms!",
    "🧠 Big brain energy detected! Albert Einstein is jealous! 🤯",
    "🚀 Houston, we have optimal complexity! 🌟",
    "🎪 Ladies and gentlemen, witness the perfect algorithm!",
    "🏆 This deserves a Nobel Prize in Computer Science!",
    "🎮 Achievement unlocked: Code Wizard! 🧙‍♂️",
    "💎 Flawless execution! Gordon Ramsay would say 'Finally, some good code!'"
  ];

  // Get random caring message
  function getCaringMessage() {
    return caringMessages[Math.floor(Math.random() * caringMessages.length)];
  }

  // Get random easter egg (10% chance for optimal solutions)
  function getEasterEgg() {
    return easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];
  }

  // Special milestone achievements
  function checkMilestones(count) {
    const milestones = {
      1: "🎉 First problem solved! Welcome to the BigOasis journey! 🌴",
      5: "🔥 5 problems down! You're getting into the groove! 💪",
      10: "🚀 Double digits! 10 problems conquered! You're unstoppable! ⭐",
      25: "🏆 Quarter century! 25 problems solved! You're a coding warrior! ⚔️",
      50: "💎 Half century! 50 problems crushed! Legendary status achieved! 👑",
      100: "🎯 CENTURY! 100 problems demolished! You're a LeetCode legend! 🔥⚡"
    };
    
    return milestones[count] || null;
  }

  // Time-based greetings
  function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    const greetings = {
      earlyMorning: ["🌅 Subah subah coding? Dedication level 💯!", "🌄 Early bird! Coffee ready hai?"],
      morning: ["☀️ Good morning, coder! Let's crush some algorithms! 💪", "🌞 Morning energy dikha do code mein!"],
      afternoon: ["🌤️ Afternoon grind! Keep going strong! 🔥", "☀️ Lunch ke baad bhi coding? Respect! 👏"],
      evening: ["🌆 Evening productivity mode ON! ✨", "🌇 Shaam ho gayi, but passion still burning! 🔥"],
      night: ["🌙 Night owl detected! Don't forget to rest 😴", "⭐ Late night coding session? You're dedicated! 🌟"],
      lateNight: ["🦉 2 AM? Yaar thoda rest karo! Health first! 💙", "🌃 Very late night! Please take care of yourself! 🤗"]
    };
    
    if (hour >= 5 && hour < 8) return greetings.earlyMorning[Math.floor(Math.random() * greetings.earlyMorning.length)];
    if (hour >= 8 && hour < 12) return greetings.morning[Math.floor(Math.random() * greetings.morning.length)];
    if (hour >= 12 && hour < 17) return greetings.afternoon[Math.floor(Math.random() * greetings.afternoon.length)];
    if (hour >= 17 && hour < 21) return greetings.evening[Math.floor(Math.random() * greetings.evening.length)];
    if (hour >= 21 || hour < 2) return greetings.night[Math.floor(Math.random() * greetings.night.length)];
    return greetings.lateNight[Math.floor(Math.random() * greetings.lateNight.length)];
  }

  // Motivational quotes for complex problems
  function getMotivationalQuote() {
    const quotes = [
      "💎 Diamonds are formed under pressure, and so are great developers! 💪",
      "🚀 Every expert was once a beginner. Keep going! ✨",
      "🌟 The code you write today is better than the code you wrote yesterday!",
      "🧗 Climbing the algorithm mountain, one step at a time! 🏔️",
      "💝 Struggling with complexity? That means you're learning! 📚",
      "🎯 Focus on progress, not perfection! You're doing great! 👏",
      "🌈 After every debugging storm comes a rainbow of working code! 🌦️",
      "🔥 Your persistence is your superpower! Don't give up! 💫"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Rate limiting
  let lastApiCall = 0;
  const MIN_API_INTERVAL = 5000; // 5 seconds between API calls
  let rateLimitWarningShown = false;

  // Position and state variables - declare early to avoid reference errors
  let panel;
  let currentX = 0;
  let currentY = 0;
  let initialX = 0;
  let initialY = 0;
  let isDragging = false;
  let isMinimized = false;
  let isHidden = false;

  // Utility function to set panel position properly
  function setPanelPosition(x, y) {
    try {
      // Boundary checks to prevent panel from going off-screen
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = panel.offsetWidth || 280;
      const panelHeight = panel.offsetHeight || 100;
      
      // Keep panel within viewport bounds
      x = Math.max(0, Math.min(x, viewportWidth - panelWidth));
      y = Math.max(0, Math.min(y, viewportHeight - panelHeight));
      
      // Use setProperty to ensure !important works correctly
      panel.style.setProperty('left', x + 'px', 'important');
      panel.style.setProperty('top', y + 'px', 'important');
      panel.style.setProperty('transform', 'none', 'important');
      currentX = x;
      currentY = y;
    } catch (error) {
      console.warn('BigOasis: Failed to set panel position:', error);
    }
  }

  // Utility functions for panel visibility
  function hidePanel() {
    if (!isHidden) {
      // Save current position before hiding
      currentX = panel.offsetLeft;
      currentY = panel.offsetTop;
      // Optional debug: console.log('Hiding panel at position:', currentX, currentY);
      isHidden = true;
      panel.style.display = 'none';
    }
  }

  function showPanel() {
    if (isHidden) {
      // Set position BEFORE showing to prevent flash
      setPanelPosition(currentX, currentY);
      panel.style.display = 'flex';
      isHidden = false;
      // Optional debug: console.log('Showing panel at position:', currentX, currentY);
    }
  }

  // Confetti animation function with performance optimization
  function createConfetti() {
    try {
      // Don't create confetti if panel is hidden or minimized
      if (isHidden || isMinimized) return;
      
      // Note: Sound is handled by the main analysis function, not here
      
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3', '#3fb950', '#ffa502'];
      const confettiCount = 60;
      const panelRect = panel.getBoundingClientRect();
      
      // Clean up any existing confetti first
      const existingConfetti = document.querySelectorAll('.bigoasis-confetti');
      existingConfetti.forEach(c => c.remove());
      
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'bigoasis-confetti';
        
        // Start from panel position
        const startX = panelRect.left + (panelRect.width / 2) + (Math.random() - 0.5) * 200;
        confetti.style.left = startX + 'px';
        confetti.style.top = panelRect.top + 'px';
        
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 8 + 5) + 'px';
        confetti.style.height = (Math.random() * 8 + 5) + 'px';
        confetti.style.animationDelay = Math.random() * 0.3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
        
        document.body.appendChild(confetti);
        
        // Auto-cleanup after animation
        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.remove();
          }
        }, 4500);
      }
    } catch (error) {
      console.warn('BigOasis: Confetti animation error:', error);
    }
  }

  function removeComments(code) {
    let cleaned = code.replace(/(?<!:)\/\/(?!\/)[^\n]*/g, '');
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
    cleaned = cleaned.replace(/(^|\n)\s*#[^\n]*/g, '$1');
    cleaned = cleaned.split('\n').filter(line => line.trim().length > 0).join('\n');
    return cleaned.trim();
  }

  async function discoverModel(apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      const err = await resp.text().catch(() => '');
      throw new Error('Failed to list models: ' + err);
    }
    const body = await resp.json();
    const models = body.models || [];

    for (const m of models) {
      const full = m.name || m.model || '';
      const short = full.split('/').pop();
      const supported = m.supportedGenerationMethods || m.supportedGeneration || m.methods || [];
      const supportsGenerate = Array.isArray(supported) && supported.some(s => /generateContent|generateText|generate/.test(String(s)));
      if (/gemini/i.test(short) && supportsGenerate) {
        return full;
      }
    }

    const candidates = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];
    for (const c of candidates) {
      const found = models.find(m => (m.name || '').includes(c) || (m.model || '').includes(c));
      if (found) return found.name || found.model || `models/${c}`;
    }

    throw new Error('No suitable Gemini model found.');
  }

  function getResourcePath(modelIdentifier) {
    if (!modelIdentifier) return null;
    if (modelIdentifier.startsWith('models/')) return modelIdentifier;
    return `models/${modelIdentifier}`;
  }
  async function analyzeWithAI(code) {
    const startTime = performance.now();
    const cleanCode = removeComments(code);
    // Optional: Log code processing for debugging
    // console.info('Original code length:', code.length, '| Clean code length:', cleanCode.length);
    
    // Rate limiting check
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCall;
    if (timeSinceLastCall < MIN_API_INTERVAL) {
      const waitTime = Math.ceil((MIN_API_INTERVAL - timeSinceLastCall) / 1000);
      throw new Error(`⏳ Please wait ${waitTime} seconds\n\nTo avoid rate limits, wait between analyses.\n\n💡 This helps keep the API available for everyone!`);
    }
    lastApiCall = now;
    
    // Check if Chrome extension APIs are available
    if (!chrome || !chrome.storage || !chrome.storage.sync) {
      throw new Error('🚫 Extension not properly loaded\n\nPlease reload the page and extension.');
    }
    
    const storage = await new Promise((res, rej) => {
      try {
        chrome.storage.sync.get(['geminiApiKey', 'aiModel', 'detectedModel'], (result) => {
          if (chrome.runtime.lastError) {
            rej(new Error(chrome.runtime.lastError.message));
          } else {
            res(result);
          }
        });
      } catch (error) {
        rej(new Error('Storage access failed: ' + error.message));
      }
    });
    
    const apiKey = storage.geminiApiKey;
    if (!apiKey) throw new Error('🔑 API Key Required\n\nPlease add your Gemini API key in extension settings.');

    let modelId = storage.aiModel || storage.detectedModel || null;
    try {
      if (!modelId) {
        const discovered = await discoverModel(apiKey);
        modelId = discovered;
        // Safe storage set with error handling
        try {
          chrome.storage.sync.set({ detectedModel: modelId });
        } catch (storageError) {
          // Silently continue if storage save fails
          // console.warn('Failed to save model to storage:', storageError);
        }
        // console.info('Discovered model:', modelId);
      }
    } catch (e) {
      // Model discovery failed, use fallback
      // console.warn('Model discovery failed:', e.message || e);
      modelId = storage.aiModel || 'gemini-2.5-flash';
    }

    const resourcePath = getResourcePath(modelId);
    if (!resourcePath) throw new Error('No model available.');
    
    // console.info('Using model resource path:', resourcePath);
    const prompt = 'You are an expert algorithm analyst. Analyze this code' + "'s time and space complexity with 100% accuracy.\n\nCode:\n```\n" + cleanCode + '\n```\n\nRules:\n- Count every loop iteration precisely\n- For nested loops, multiply complexities\n- For recursion, solve the recurrence relation\n- Consider worst-case scenario\n- If complexity is poor (O(n) or worse), suggest ONE brief optimization\n\nReturn ONLY this JSON (no markdown):\n{\n  "timeComplexity": "O(...)",\n  "spaceComplexity": "O(...)",\n  "explanation": "Brief 1-2 sentence explanation",\n  "optimization": "If poor, suggest improvement in 1 sentence (optional)"\n}';

    const url = `https://generativelanguage.googleapis.com/v1beta/${resourcePath}:generateContent?key=${apiKey}`;
    // console.info('Calling generateContent URL:', url.replace(apiKey, 'XXX'));
    
    let response;
    const maxAttempts = 3;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.1, 
            topP: 0.95, 
            topK: 40, 
            maxOutputTokens: 8192
          }
        })
      });

      if (response.ok) break;

      const status = response.status;
      if (status === 429 || status === 503 || status === 504) {
        const waitMs = Math.min(1000 * Math.pow(2, attempt), 30000); // Cap at 30 seconds
        const waitSeconds = Math.ceil(waitMs / 1000);
        
        // Show user-friendly message with countdown
        if (attempt === 0) {
          console.warn(`Rate limit hit (status ${status}) - implementing smart retry...`);
        }
        
        console.warn(`Waiting ${waitSeconds}s before retry ${attempt + 1}/3...`);
        
        // If this is the UI result element, show countdown
        const resultElement = document.getElementById('bigoasis-result');
        if (resultElement && attempt < 2) {
          resultElement.innerHTML = `
            <div class="bigoasis-result-line">
              ⏳ <strong>Rate limit reached</strong> - waiting ${waitSeconds}s...
            </div>
            <div class="bigoasis-result-line" style="font-size: 11px; opacity: 0.7;">
              Retry ${attempt + 1}/3 - Please be patient
            </div>
          `;
        }
        
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }

      break;
    }
    if (!response.ok) {
        let errBody;
        try { errBody = await response.json(); } catch (e) { errBody = await response.text().catch(()=>''); }
        const message = (errBody && (errBody.error?.message || JSON.stringify(errBody))) || 'Unknown API error';
        const status = response.status;
        console.error('API non-ok response', status, message);
        if (String(message).includes('API_KEY_INVALID') || String(message).includes('invalid') || status === 401 || status === 403) {
          throw new Error('🔑 Invalid API Key\n\nCheck your key in extension settings.');
        }
        if (status === 404) {
          throw new Error(`❌ Model not found: ${resourcePath}`);
        }
        if (status === 429 || String(message).toLowerCase().includes('rate') || status === 503 || status === 504) {
          const waitTime = Math.ceil(Math.random() * 30 + 30); // Random wait between 30-60 seconds
          throw new Error(`⏳ Rate limit exceeded\n\nPlease wait ${waitTime} seconds before trying again.\n\n💡 Tip: Try using a simpler code snippet or wait longer between analyses.`);
        }
        throw new Error('API Error (status ' + status + '): ' + message);
    }

    const data = await response.json();
    // Optional debug: console.info('AI API response data:', data);
    
    if (data.candidates && data.candidates[0]) {
      const finishReason = data.candidates[0].finishReason;
      if (finishReason === 'MAX_TOKENS') {
        throw new Error('⚠️ Response cut off. Try shorter code.');
      }
      if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
        throw new Error('🛡️ Response blocked by safety filters.');
      }
    }
    
    let text = '';
    try {
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        text = data.candidates[0].content.parts.map(p=>p.text||'').join('\n');
      } else if (typeof data === 'string') {
        text = data;
      } else {
        text = JSON.stringify(data);
      }
    } catch (e) {
      text = JSON.stringify(data);
    }
    
    // console.info('Extracted AI text response:', text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('AI response did not contain JSON. Full text:', text);
      throw new Error('Unexpected AI response format.');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    // console.info('Parsed JSON result:', result);
    
    const endTime = performance.now();
    const analysisTime = ((endTime - startTime) / 1000).toFixed(2);
    
    // Increment problem counter and check if caring message should be shown
    const shouldShowCaringMessage = await incrementProblemCounter();
    const milestoneMessage = checkMilestones(problemsSolved);
    
    // Determine which message to show based on complexity and problem count
    let messageToShow = null;
    const timeComplexity = result.timeComplexity || result.time || '';
    const isOptimal = /o\(1\)|o\(log\s*n\)/i.test(timeComplexity);
    const isComplex = /o\(n\s*[\^]|o\(2\s*\^|o\(n\s*!\)/i.test(timeComplexity);
    
    // Priority: Milestone > Caring Message > Easter Egg > Regular celebration
    if (milestoneMessage) {
      // Special milestone achievements take priority
      messageToShow = milestoneMessage;
      // Reset caring message counter when milestone is reached to avoid conflicts
      // (user gets milestone celebration instead of caring message)
    } else if (shouldShowCaringMessage) {
      // Every 3rd problem: show caring message regardless of complexity
      messageToShow = getCaringMessage();
    } else if (isOptimal) {
      // For optimal solutions: 10% chance for easter egg, otherwise celebration
      if (Math.random() < 0.1) {
        messageToShow = getEasterEgg();
      } else {
        messageToShow = `🎉 Optimal solution! You're crushing it! Total solved: ${problemsSolved} 🚀`;
      }
    } else if (isComplex) {
      // For complex solutions: show motivational quote only
      messageToShow = getMotivationalQuote();
    }
    // For medium complexity: no message (keep it clean)
    
    return { 
      time: result.timeComplexity || result.time || 'N/A', 
      space: result.spaceComplexity || result.space || 'N/A', 
      why: result.explanation || 'No explanation',
      optimization: result.optimization || null,
      analysisTime: analysisTime,
      timestamp: new Date().toLocaleTimeString(),
      caringMessage: messageToShow
    };
  }

  async function showSettingsModal() {
    // Remove any existing modal
    const existingModal = document.getElementById('bigoasis-settings-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Temporarily lower the panel z-index to ensure modal appears on top
    if (panel) {
      panel.style.zIndex = '2147483640';
    }

    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'bigoasis-settings-modal';
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 2147483650;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #1a1d23;
      color: #e6e6e6;
      border-radius: 12px;
      padding: 30px;
      width: 500px;
      max-width: 90vw;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      font-family: system-ui, -apple-system, sans-serif;
      transform: scale(0.9);
      animation: modalIn 0.3s ease forwards;
    `;

    // Get current settings
    let currentApiKey = '';
    let currentModel = '';
    
    try {
      if (chrome && chrome.storage && chrome.storage.sync) {
        const result = await new Promise((resolve, reject) => {
          chrome.storage.sync.get(['geminiApiKey', 'aiModel'], (result) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(result);
            }
          });
        });
        currentApiKey = result.geminiApiKey || '';
        currentModel = result.aiModel || '';
      }
    } catch (error) {
      console.warn('Failed to load current settings:', error);
    }

    modal.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
        <span style="font-size: 24px;">⚙️</span>
        <h2 style="margin: 0; color: #fff;">BigOasis Settings</h2>
      </div>
      
      <div style="margin-bottom: 25px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #ccc;">
          🔑 Google Gemini API Key
        </label>
        <input type="password" id="modal-api-key" value="${currentApiKey}" 
               placeholder="Enter your Gemini API key"
               style="width: 100%; padding: 12px; border: 2px solid #444; border-radius: 6px; 
                      background: #2a2d35; color: #fff; font-size: 14px; box-sizing: border-box;">
        <div style="font-size: 12px; color: #888; margin-top: 5px;">
          Get your free API key from 
          <a href="https://aistudio.google.com/app/apikey" target="_blank" 
             style="color: #3498db; text-decoration: none;">Google AI Studio</a>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #ccc;">
          🤖 AI Model
        </label>
        <select id="modal-ai-model" 
                style="width: 100%; padding: 12px; border: 2px solid #444; border-radius: 6px; 
                       background: #2a2d35; color: #fff; font-size: 14px; box-sizing: border-box;">
          <option value="gemini-2.5-flash" ${currentModel === 'gemini-2.5-flash' || !currentModel ? 'selected' : ''}>Gemini 2.5 Flash (Recommended)</option>
          <option value="gemini-2.5-pro" ${currentModel === 'gemini-2.5-pro' ? 'selected' : ''}>Gemini 2.5 Pro (Best quality)</option>
          <option value="gemini-2.0-flash" ${currentModel === 'gemini-2.0-flash' ? 'selected' : ''}>Gemini 2.0 Flash (Fastest)</option>
        </select>
      </div>
      
      <div style="margin-bottom: 25px; padding: 16px; background: rgba(52, 152, 219, 0.1); border: 1px solid rgba(52, 152, 219, 0.2); border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 16px;">💙</span>
          <span style="font-size: 14px; font-weight: 600; color: #3498db;">Enjoying BigOasis?</span>
        </div>
        <div style="font-size: 13px; color: #bbb; margin-bottom: 12px; line-height: 1.4;">
          BigOasis is free and open-source. If it's helping you ace those coding interviews, consider supporting development!
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <a href="https://www.buymeacoffee.com/narendraxgupta" target="_blank" 
             style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; 
                    background: #FFDD00; color: #000; text-decoration: none; border-radius: 6px; 
                    font-size: 12px; font-weight: 600; transition: transform 0.2s;">
            ☕ Buy me a coffee
          </a>
          <!-- 
          <a href="https://github.com/sponsors/bigoasis" target="_blank" 
             style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; 
                    background: #ea4aaa; color: #fff; text-decoration: none; border-radius: 6px; 
                    font-size: 12px; font-weight: 600; transition: transform 0.2s;">
            💖 GitHub Sponsor
          </a>
          <a href="https://paypal.me/bigoasis" target="_blank" 
             style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; 
                    background: #0070ba; color: #fff; text-decoration: none; border-radius: 6px; 
                    font-size: 12px; font-weight: 600; transition: transform 0.2s;">
            💳 PayPal
          </a>
          <a href="upi://pay?pa=yourupiid@paytm&pn=BigOasis&mc=0000&tid=1234567890&url=https://bigoasis.dev" target="_blank" 
             style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; 
                    background: #00C851; color: #fff; text-decoration: none; border-radius: 6px; 
                    font-size: 12px; font-weight: 600; transition: transform 0.2s;">
            📱 UPI Pay
          </a>
          <a href="https://paytm.me/bigoasis" target="_blank" 
             style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; 
                    background: #002970; color: #fff; text-decoration: none; border-radius: 6px; 
                    font-size: 12px; font-weight: 600; transition: transform 0.2s;">
            💙 Paytm
          </a>
          <a href="https://rzp.io/l/bigoasis" target="_blank" 
             style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; 
                    background: #528FF0; color: #fff; text-decoration: none; border-radius: 6px; 
                    font-size: 12px; font-weight: 600; transition: transform 0.2s;">
            ⚡ Razorpay
          </a>
          -->
        </div>
        <div style="font-size: 11px; color: #888; margin-top: 8px; font-style: italic;">
          Every contribution helps maintain and improve BigOasis ✨
        </div>
      </div>
      
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button id="modal-cancel" 
                style="background: #555; color: #fff; border: none; padding: 10px 20px; 
                       border-radius: 6px; cursor: pointer; font-size: 14px;">
          Cancel
        </button>
        <button id="modal-save" 
                style="background: #3498db; color: #fff; border: none; padding: 10px 20px; 
                       border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">
          💾 Save Settings
        </button>
      </div>
      
      <div id="modal-status" style="margin-top: 15px; font-size: 14px; display: none;"></div>
    `;

    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes modalIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .donation-link:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
      }
    `;
    document.head.appendChild(style);

    // Add hover class to donation links
    const donationLinks = modal.querySelectorAll('a[href*="buymeacoffee"]');
    donationLinks.forEach(link => {
      link.classList.add('donation-link');
    });

    // Function to restore panel z-index when modal closes
    const restorePanelZIndex = () => {
      if (panel) {
        panel.style.zIndex = '2147483647';
      }
    };

    // Event handlers
    document.getElementById('modal-cancel').addEventListener('click', () => {
      modalOverlay.remove();
      style.remove();
      restorePanelZIndex();
    });

    document.getElementById('modal-save').addEventListener('click', async () => {
      const apiKey = document.getElementById('modal-api-key').value.trim();
      const aiModel = document.getElementById('modal-ai-model').value;
      const statusDiv = document.getElementById('modal-status');
      
      if (!apiKey) {
        statusDiv.textContent = '❌ Please enter your API key';
        statusDiv.style.color = '#ff6b6b';
        statusDiv.style.display = 'block';
        return;
      }
      
      try {
        if (chrome && chrome.storage && chrome.storage.sync) {
          await new Promise((resolve, reject) => {
            chrome.storage.sync.set({ geminiApiKey: apiKey, aiModel: aiModel }, () => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
              } else {
                resolve();
              }
            });
          });
        } else {
          throw new Error('Chrome storage not available');
        }
        
        statusDiv.textContent = '✅ Settings saved successfully!';
        statusDiv.style.color = '#51cf66';
        statusDiv.style.display = 'block';
        
        setTimeout(() => {
          modalOverlay.remove();
          style.remove();
          restorePanelZIndex();
        }, 1500);
        
      } catch (error) {
        statusDiv.textContent = '❌ Failed to save: ' + error.message;
        statusDiv.style.color = '#ff6b6b';
        statusDiv.style.display = 'block';
      }
    });

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
        style.remove();
        restorePanelZIndex();
      }
    });

    // Close on Escape key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        modalOverlay.remove();
        style.remove();
        restorePanelZIndex();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  panel = document.createElement('div');
  panel.id = 'bigoasis-panel';

  const header = document.createElement('div');
  header.id = 'bigoasis-header';

  function getComplexityClass(complexity) {
    const c = String(complexity).toLowerCase();
    if (/o\(1\)|o\(log\s*n\)/i.test(c)) return 'bigoasis-complexity-good';
    if (/o\(n\s*log\s*n\)|o\(n\)(?!\s*[\^])/i.test(c)) return 'bigoasis-complexity-medium';
    if (/o\(n\s*[\^]|o\(2\s*\^|o\(n\s*!\)|o\(n\s*\*\s*n\)/i.test(c)) return 'bigoasis-complexity-poor';
    return 'bigoasis-complexity-medium';
  }

  function getComplexityIcon(complexity) {
    const c = String(complexity).toLowerCase();
    if (/o\(1\)|o\(log\s*n\)/i.test(c)) return '🟢';
    if (/o\(n\s*log\s*n\)|o\(n\)(?!\s*[\^])/i.test(c)) return '🟡';
    if (/o\(n\s*[\^]|o\(2\s*\^|o\(n\s*!\)|o\(n\s*\*\s*n\)/i.test(c)) return '🔴';
    return '🟡';
  }

  function pretty(out){
    const tcClass = getComplexityClass(out.time);
    const scClass = getComplexityClass(out.space);
    const tcIcon = getComplexityIcon(out.time);
    const scIcon = getComplexityIcon(out.space);
    
    let html = `<div class="bigoasis-result-line">⏱ <strong>Time:</strong> ${tcIcon} <span class="${tcClass}">${out.time}</span></div>` +
           `<div class="bigoasis-result-line">💾 <strong>Space:</strong> ${scIcon} <span class="${scClass}">${out.space}</span></div>` +
           `<div class="bigoasis-result-line">💡 <strong>Why:</strong> ${out.why}</div>`;
    
    if (out.optimization) {
      html += `<div class="bigoasis-result-line bigoasis-optimization">⚡ <strong>Tip:</strong> ${out.optimization}</div>`;
    }
    
    // Add caring message after analysis
    if (out.caringMessage) {
      html += `<div class="bigoasis-result-line bigoasis-caring-message">${out.caringMessage}</div>`;
    }
    
    // Add progress bar for next caring message (only if not just shown)
    if (!out.caringMessage || !out.caringMessage.includes('3 problems')) {
      const progress = ((problemsSolved % CARING_MESSAGE_INTERVAL) / CARING_MESSAGE_INTERVAL) * 100;
      html += `<div class="bigoasis-progress-bar"><div class="bigoasis-progress-fill" style="width: ${progress}%"></div></div>`;
    }
    
    if (out.analysisTime) {
      html += `<div class="bigoasis-result-line bigoasis-analysis-time">⏱️ Analysis took ${out.analysisTime}s</div>`;
    }
    
    return html;
  }
  
  const badge = document.createElement('div');
  badge.id = 'bigoasis-badge';
  badge.textContent = 'BigOasis 🌴 TC & SC';
  
  const btn = document.createElement('button');
  btn.id = 'bigoasis-run';
  btn.textContent = 'Analyze';
  btn.title = 'Analyze (Ctrl+Shift+A)';
  
  const copyBtn = document.createElement('button');
  copyBtn.id = 'bigoasis-copy-btn';
  copyBtn.textContent = '📋';
  copyBtn.title = 'Copy results';
  copyBtn.style.display = 'none';
  copyBtn.className = 'bigoasis-copy-btn';
  
  const settingsBtn = document.createElement('button');
  settingsBtn.id = 'bigoasis-settings-btn';
  settingsBtn.textContent = '⚙️';
  settingsBtn.title = 'Settings & API Key';
  settingsBtn.className = 'bigoasis-settings-btn';
  
  const soundBtn = document.createElement('button');
  soundBtn.id = 'bigoasis-sound-btn';
  soundBtn.textContent = '🔊';
  soundBtn.title = 'Toggle sound effects';
  soundBtn.className = 'bigoasis-sound-btn';
  
  const minimizeBtn = document.createElement('button');
  minimizeBtn.id = 'bigoasis-minimize-btn';
  minimizeBtn.textContent = '−';
  minimizeBtn.title = 'Minimize';
  minimizeBtn.className = 'bigoasis-minimize-btn';
  
  const closeBtn = document.createElement('button');
  closeBtn.id = 'bigoasis-close-btn';
  closeBtn.textContent = '✕';
  closeBtn.title = 'Hide panel (Ctrl+Shift+H)';
  closeBtn.className = 'bigoasis-close-btn';
  
  const transparentBtn = document.createElement('button');
  transparentBtn.id = 'bigoasis-transparent-btn';
  transparentBtn.textContent = '👁️';
  transparentBtn.title = 'Toggle transparency';
  transparentBtn.className = 'bigoasis-transparent-btn';
  
  const divider = document.createElement('div');
  divider.id = 'bigoasis-divider';
  
  header.appendChild(badge);
  header.appendChild(btn);
  header.appendChild(copyBtn);
  header.appendChild(settingsBtn);
  header.appendChild(soundBtn);
  header.appendChild(minimizeBtn);
  header.appendChild(transparentBtn);
  header.appendChild(closeBtn);
  header.appendChild(divider);
  
  const result = document.createElement('div');
  result.id = 'bigoasis-result';
  result.textContent = 'Ctrl+Shift+A to analyze | Ctrl+Shift+H to hide';
  
  panel.appendChild(header);
  panel.appendChild(result);
  document.documentElement.appendChild(panel);

  // Initialize position
  const rect = panel.getBoundingClientRect();
  currentX = rect.left;
  currentY = rect.top;
  
  // Set explicit positioning to override CSS centering
  setPanelPosition(currentX, currentY);

  header.addEventListener('mousedown', (e) => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    isDragging = true;
    initialX = e.clientX - currentX;
    initialY = e.clientY - currentY;
    panel.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      const newX = e.clientX - initialX;
      const newY = e.clientY - initialY;
      setPanelPosition(newX, newY);
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      panel.style.cursor = 'default';
    }
  });
  btn.addEventListener('click', async (e)=>{
    e.stopPropagation();
    e.preventDefault();
    
    // Check rate limiting before making API call
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCall;
    if (timeSinceLastCall < MIN_API_INTERVAL) {
      const waitTime = Math.ceil((MIN_API_INTERVAL - timeSinceLastCall) / 1000);
      result.innerHTML = `
        <div class="bigoasis-result-line">
          ⏳ <strong>Please wait ${waitTime} seconds</strong>
        </div>
        <div class="bigoasis-result-line" style="font-size: 11px; opacity: 0.7;">
          Rate limiting prevents API overuse
        </div>
      `;
      
      // Start countdown
      const countdown = setInterval(() => {
        const remaining = Math.ceil((MIN_API_INTERVAL - (Date.now() - lastApiCall)) / 1000);
        if (remaining <= 0) {
          clearInterval(countdown);
          result.innerHTML = '<div class="bigoasis-result-line">✅ Ready to analyze!</div>';
        } else {
          result.innerHTML = `
            <div class="bigoasis-result-line">
              ⏳ <strong>Please wait ${remaining} seconds</strong>
            </div>
            <div class="bigoasis-result-line" style="font-size: 11px; opacity: 0.7;">
              Rate limiting prevents API overuse
            </div>
          `;
        }
      }, 1000);
      
      return;
    }
    
    result.innerHTML = '<span class="bigoasis-loading"></span>Analyzing with AI...';
    copyBtn.style.display = 'none';
    
    const code = await getCodeFromPage();
    if(!code){
      result.textContent = '❌ Could not read code.';
      return;
    }
    
    try {
      const aiResult = await analyzeWithAI(code);
      result.innerHTML = pretty(aiResult);
      copyBtn.style.display = 'inline-block';
      
      // Play appropriate sound effect based on result
      const timeComplexity = aiResult.time.toLowerCase();
      const isOptimal = /o\(1\)|o\(log\s*n\)/i.test(timeComplexity);
      const isComplex = /o\(n\s*[\^]|o\(2\s*\^|o\(n\s*!\)/i.test(timeComplexity);
      
      // Determine sound based on message type
      if (aiResult.caringMessage) {
        if (aiResult.caringMessage.includes('🎯') || aiResult.caringMessage.includes('🏆')) {
          // Milestone achievement
          soundEffects.playAchievement();
        } else if (aiResult.caringMessage.includes('3 problems')) {
          // Caring message
          soundEffects.playChime();
        } else if (aiResult.caringMessage.includes('🐛') || aiResult.caringMessage.includes('Marie Kondo')) {
          // Easter egg
          soundEffects.playEasterEgg();
        } else if (isOptimal) {
          // Optimal solution
          soundEffects.playSuccess();
        } else {
          // Default notification
          soundEffects.playNotification();
        }
      } else {
        // No special message, just play notification
        soundEffects.playNotification();
      }
      
      // Trigger confetti for excellent complexity!
      if (timeComplexity.includes('o(1)') || timeComplexity.includes('o(log')) {
        createConfetti();
      }
      
      // Auto-expand if minimized
      if (isMinimized) {
        isMinimized = false;
        panel.classList.remove('minimized');
        minimizeBtn.textContent = '−';
      }
      
    } catch (error) {
      result.textContent = error.message || '❌ Analysis failed.';
      
      // Auto-expand if minimized to show error
      if (isMinimized) {
        isMinimized = false;
        panel.classList.remove('minimized');
        minimizeBtn.textContent = '−';
      }
    }
  });

  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = result.innerHTML;
    
    // Extract complexity values
    const complexityElements = tempDiv.querySelectorAll('.bigoasis-complexity-good, .bigoasis-complexity-medium, .bigoasis-complexity-poor');
    const timeComplexity = complexityElements[0] ? complexityElements[0].textContent.trim() : 'N/A';
    const spaceComplexity = complexityElements[1] ? complexityElements[1].textContent.trim() : 'N/A';
    
    // Extract Why explanation
    const whyElement = tempDiv.querySelector('.bigoasis-result-line:nth-child(3)');
    let whyText = 'N/A';
    if (whyElement) {
      const strongTag = whyElement.querySelector('strong');
      whyText = strongTag ? whyElement.textContent.replace(strongTag.textContent, '').trim() : whyElement.textContent.trim();
      whyText = whyText.replace(/^💡\s*/, '').trim();
    }
    
    // Extract Tip if exists
    const tipElement = tempDiv.querySelector('.bigoasis-optimization');
    let tipText = '';
    if (tipElement) {
      const strongTag = tipElement.querySelector('strong');
      tipText = strongTag ? tipElement.textContent.replace(strongTag.textContent, '').trim() : tipElement.textContent.trim();
      tipText = tipText.replace(/^⚡\s*/, '').trim();
    }
    
    // Create comment format
    let shareText = `/* TC: ${timeComplexity}\n   SC: ${spaceComplexity}\n   Why: ${whyText}`;
    if (tipText) {
      shareText += `\n   Tip: ${tipText}`;
    }
    shareText += ` */`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = '✅';
      copyBtn.classList.add('copied');
      setTimeout(() => { 
        copyBtn.textContent = orig; 
        copyBtn.classList.remove('copied');
      }, 1000);
    });
  });

  minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isMinimized = !isMinimized;
    if (isMinimized) {
      panel.classList.add('minimized');
      minimizeBtn.textContent = '+';
    } else {
      panel.classList.remove('minimized');
      minimizeBtn.textContent = '−';
    }
  });

  transparentBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isTransparent = !isTransparent;
    if (isTransparent) {
      panel.style.backgroundColor = 'rgba(15, 17, 21, 0.7)';
      panel.style.backdropFilter = 'blur(10px)';
      transparentBtn.textContent = '👁️‍🗨️';
    } else {
      panel.style.backgroundColor = '#0f1115';
      panel.style.backdropFilter = 'none';
      transparentBtn.textContent = '👁️';
    }
  });

  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const enabled = soundEffects.toggle();
    soundBtn.textContent = enabled ? '🔊' : '🔇';
    soundBtn.title = enabled ? 'Sound ON - Click to mute' : 'Sound OFF - Click to enable';
    
    if (enabled) {
      soundBtn.classList.remove('muted');
      soundEffects.playNotification(); // Test sound
    } else {
      soundBtn.classList.add('muted');
    }
  });

  settingsBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    
    // Try to open the extension options page
    if (chrome.runtime && chrome.runtime.openOptionsPage) {
      try {
        chrome.runtime.openOptionsPage();
      } catch (error) {
        console.warn('Failed to open options page:', error);
        showSettingsModal();
      }
    } else {
      // Fallback: show inline settings modal
      showSettingsModal();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hidePanel();
  });

  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+A to analyze
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      if (!isHidden) {
        btn.click();
      }
    }
    
    // Ctrl+Shift+H to hide/show panel
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'H') {
      e.preventDefault();
      if (isHidden) {
        showPanel();
      } else {
        hidePanel();
      }
    }
  });

  function getCodeFromPage(){
    return new Promise((resolve)=>{
      function handler(e){
        document.removeEventListener('bigoasis-code', handler);
        resolve(e.detail || '');
      }
      document.addEventListener('bigoasis-code', handler);
      const s = document.createElement('script');
      s.src = chrome.runtime.getURL('pageBridge.js');
      (document.head||document.documentElement).appendChild(s);
      s.remove();
    });
  }

  // Initialize extension and check for API key
  async function initializeExtension() {
    try {
      // Initialize sound system
      soundEffects.init();
      
      // Load problem counter first
      await loadProblemCounter();
      
      // Check if Chrome extension APIs are available
      if (!chrome || !chrome.storage || !chrome.storage.sync) {
        console.warn('BigOasis: Extension APIs not available');
        return;
      }
      
      // Check for API key
      const result = await new Promise((resolve, reject) => {
        try {
          chrome.storage.sync.get(['geminiApiKey'], (result) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(result);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
      
      if (!result.geminiApiKey) {
        // Show a friendly notification that API key is needed
        setTimeout(() => {
          const notification = document.createElement('div');
          notification.innerHTML = `
            <div style="
              position: fixed;
              top: 20px;
              right: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 16px 20px;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.3);
              z-index: 10001;
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 14px;
              max-width: 350px;
              cursor: pointer;
              transform: translateX(400px);
              transition: transform 0.3s ease;
            ">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 18px;">🔑</span>
                <strong>BigOasis Extension Ready!</strong>
              </div>
              <div style="margin-bottom: 12px; opacity: 0.9;">
                Click here to set up your Gemini API key and start analyzing code complexity.
              </div>
              <div style="font-size: 12px; opacity: 0.7;">
                💡 Get your free API key from Google AI Studio
              </div>
              <div style="font-size: 11px; opacity: 0.5; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;">
                Made with 💙 by developers, for developers
              </div>
            </div>
          `;
          
          document.body.appendChild(notification);
          
          // Animate in
          setTimeout(() => {
            notification.firstElementChild.style.transform = 'translateX(0)';
          }, 100);
          
          // Click to open options
          notification.addEventListener('click', () => {
            if (chrome.runtime && chrome.runtime.openOptionsPage) {
              chrome.runtime.openOptionsPage();
            } else {
              // Fallback: show instructions
              alert('🔑 To set up BigOasis:\n\n1. Right-click the extension icon\n2. Select "Options"\n3. Enter your Gemini API key\n\nGet your free API key from: https://aistudio.google.com/app/apikey');
            }
          });
          
          // Auto-hide after 8 seconds
          setTimeout(() => {
            if (notification.parentNode) {
              notification.firstElementChild.style.transform = 'translateX(400px)';
              setTimeout(() => {
                if (notification.parentNode) {
                  notification.remove();
                }
              }, 300);
            }
          }, 8000);
          
        }, 2000); // Wait 2 seconds after page load
      } else {
        console.info('BigOasis: API key configured ✓');
      }
    } catch (error) {
      console.warn('BigOasis initialization error:', error);
    }
  }

  // Start initialization with error boundary
  function safeInitialize() {
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeExtension);
      } else {
        initializeExtension();
      }
    } catch (error) {
      console.error('BigOasis: Critical initialization error:', error);
    }
  }

  // Cleanup function for when extension is disabled
  function cleanup() {
    try {
      if (panel && panel.parentNode) {
        panel.remove();
      }
      // Remove any lingering confetti
      const confetti = document.querySelectorAll('.bigoasis-confetti');
      confetti.forEach(c => c.remove());
      // Remove any notification elements
      const notifications = document.querySelectorAll('#bigoasis-settings-modal');
      notifications.forEach(n => n.remove());
    } catch (error) {
      console.warn('BigOasis: Cleanup error:', error);
    }
  }

  // Handle page unload
  window.addEventListener('beforeunload', cleanup);

  safeInitialize();

})();