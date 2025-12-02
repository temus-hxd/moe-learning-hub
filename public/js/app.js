// Isaac's Learning Platform - Main App Logic

class MOEBuddy {
    constructor() {
        this.apiKey = null;
        this.chatMessages = [];
        this.isOpen = false;
        
        this.init();
    }
    
    async init() {
        // Load API key securely
        try {
            const config = await ConfigLoader.loadConfig();
            this.apiKey = config.OPENROUTER_API_KEY;
        } catch (error) {
            console.error('Failed to load API configuration:', error);
            return;
        }
        
        this.setupEventListeners();
        this.addWelcomeMessage();
    }
    
    setupEventListeners() {
        const toggleButton = document.getElementById('toggleBuddy');
        const closeButton = document.getElementById('closeBuddy');
        const sendButton = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');
        
        toggleButton.addEventListener('click', () => this.toggleChat());
        closeButton.addEventListener('click', () => this.closeChat());
        sendButton.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }
    
    toggleChat() {
        const panel = document.getElementById('moeBuddyPanel');
        const toggleButton = document.getElementById('toggleBuddy');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            panel.style.display = 'block';
            panel.style.transform = 'translateY(0)';
            toggleButton.style.display = 'none';
            this.isOpen = true;
        }
    }
    
    closeChat() {
        const panel = document.getElementById('moeBuddyPanel');
        const toggleButton = document.getElementById('toggleBuddy');
        
        panel.style.transform = 'translateY(20px)';
        panel.style.opacity = '0';
        setTimeout(() => {
            panel.style.display = 'none';
            panel.style.transform = 'translateY(0)';
            panel.style.opacity = '1';
        }, 300);
        toggleButton.style.display = 'flex';
        this.isOpen = false;
    }
    
    addWelcomeMessage() {
        // Don't add to chatMessages array since it's already in HTML
        // Just ensure the initial message is there
    }
    
    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessageToChat(message, 'user');
        input.value = '';
        
        // Add empty assistant message for streaming
        const assistantMessageId = this.addMessageToChat('', 'assistant');
        
        try {
            await this.getAIResponseStreaming(message, assistantMessageId);
        } catch (error) {
            this.updateMessage(assistantMessageId, "🔧 Connection lost to the quest server, Isaac! Try your command again in a moment - Block Buddy will be back online soon! 🎮");
        }
    }
    
    addMessageToChat(message, role) {
        const chatContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        const messageId = Date.now() + Math.random();
        
        if (role === 'user') {
            messageDiv.className = 'flex justify-end mb-4';
            messageDiv.innerHTML = `
                <div class="text-white px-4 py-3 max-w-[80%] buddy-chat-bubble font-cyber" style="background: var(--color-secondary); border: 3px solid var(--color-text); box-shadow: var(--shadow-blocky);">
                    <p class="text-sm leading-relaxed">${message}</p>
                </div>
            `;
        } else {
            messageDiv.className = 'flex justify-start mb-4';
            messageDiv.innerHTML = `
                <div class="p-4 max-w-[85%] buddy-chat-bubble" style="background: var(--color-white); border: 3px solid var(--color-text); box-shadow: var(--shadow-blocky);">
                    <div class="flex items-start space-x-3">
                        <div class="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5" style="background: var(--color-secondary); border: 2px solid var(--color-text);">
                            <i data-lucide="zap" class="w-3 h-3 text-white"></i>
                        </div>
                        <p class="text-sm font-cyber leading-relaxed" style="color: var(--color-text);" data-message-id="${messageId}">${message}</p>
                    </div>
                </div>
            `;
        }
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Re-initialize icons for new messages
        lucide.createIcons();
        
        // Add to messages array only if message has content
        if (message.trim()) {
            this.chatMessages.push({ role, content: message });
        }
        
        return messageId;
    }
    
    updateMessage(messageId, newContent) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            messageElement.textContent = newContent;
            
            // Update or add to message history
            const lastAssistantIndex = this.chatMessages.findLastIndex(msg => msg.role === 'assistant');
            if (lastAssistantIndex !== -1) {
                this.chatMessages[lastAssistantIndex].content = newContent;
            } else {
                this.chatMessages.push({ role: 'assistant', content: newContent });
            }
            
            // Scroll to bottom
            const chatContainer = document.getElementById('chatMessages');
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
    
    showThinking() {
        const chatContainer = document.getElementById('chatMessages');
        const thinkingDiv = document.createElement('div');
        thinkingDiv.id = 'thinking-indicator';
        thinkingDiv.className = 'flex justify-start mb-4';
        thinkingDiv.innerHTML = `
            <div class="p-4 max-w-[85%]" style="background: var(--color-white); border: 3px solid var(--color-text); box-shadow: var(--shadow-blocky);">
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 flex items-center justify-center" style="background: var(--color-secondary); border: 2px solid var(--color-text);">
                        <i data-lucide="gamepad-2" class="w-3 h-3 text-white"></i>
                    </div>
                    <div class="flex items-center space-x-2">
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 animate-pulse" style="background: var(--color-secondary); border: 1px solid var(--color-text);"></div>
                            <div class="w-2 h-2 animate-pulse" style="background: var(--color-secondary); border: 1px solid var(--color-text); animation-delay: 0.2s"></div>
                            <div class="w-2 h-2 animate-pulse" style="background: var(--color-secondary); border: 1px solid var(--color-text); animation-delay: 0.4s"></div>
                        </div>
                        <span class="text-xs font-bold font-pixel" style="color: var(--color-text); font-size: 8px;">🎮 BLOCK BUDDY PROCESSING...</span>
                    </div>
                </div>
            </div>
        `;
        chatContainer.appendChild(thinkingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        lucide.createIcons();
    }
    
    hideThinking() {
        const thinkingIndicator = document.getElementById('thinking-indicator');
        if (thinkingIndicator) {
            thinkingIndicator.remove();
        }
    }
    
    async getAIResponseStreaming(userMessage, messageId) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Isaac Learning Platform'
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are Block Buddy, an epic game companion AI for Isaac Chen, a 14-year-old quest master in Singapore exploring the Singapore Independence Quest game.

ISAAC'S PLAYER PROFILE:
- Level 7 Quest Master 🏆
- Analytical strategist who loves solving quest puzzles
- Visual learner who prefers timeline challenges and cause-effect missions
- Currently on the Singapore Independence Quest campaign
- Prefers solo gameplay with detailed quest logs

CURRENT QUEST CONTEXT:
- Campaign: Singapore Independence Quest
- Current Mission: People's Action Party Formation (1954)
- Quest Status: Active
- Player has completed tutorial and basic knowledge challenges

YOUR PERSONALITY AS BLOCK BUDDY:
- Epic game companion with enthusiasm 🎮
- Use gaming terminology (quests, missions, achievements, levels)
- Encourage strategic thinking for quest completion
- Provide quest hints and power-ups
- Reference game mechanics like timelines, battles, and collectibles
- Keep responses exciting but helpful (2-3 sentences max)
- Use gaming emojis and terminology

GAME FEATURES TO REFERENCE:
- Timeline Battle Challenges
- Primary Source Collection mini-games
- Cause-and-Effect Strategy puzzles
- Solo Campaign mode
- Achievement system and trophies

SINGAPORE QUEST WORLD:
- Use Singapore context as the game world setting
- Reference historical figures as NPCs
- Mention quest locations based on real Singapore places
- Connect past events to present-day Singapore as "endgame content"

Respond as Block Buddy would to Isaac's quest-related questions in this epic Singapore History adventure game!`
                    },
                    ...this.chatMessages.slice(-5), // Keep last 5 messages for context
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 150,
                stream: true
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                fullResponse += content;
                                this.updateMessage(messageId, fullResponse);
                            }
                        } catch (e) {
                            // Skip invalid JSON chunks
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        return fullResponse;
    }
}

// Learning Platform Features
class LearningPlatform {
    constructor() {
        this.currentProgress = 68;
        this.studyStreak = 7;
        this.accuracyRate = 85;
        this.lessonsCompleted = 24;
        
        this.init();
    }
    
    init() {
        this.animateProgressBars();
        this.setupInteractiveElements();
        this.startStreakAnimation();
    }
    
    animateProgressBars() {
        // Animate main progress bar
        const progressBar = document.querySelector('.bg-gradient-to-r.from-green-400.to-blue-500');
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.width = `${this.currentProgress}%`;
            }, 500);
        }
        
        // Animate timeline master progress - fix selector
        const timelineProgress = document.querySelector('.w-16 .bg-blue-400');
        if (timelineProgress) {
            setTimeout(() => {
                timelineProgress.classList.add('transition-all');
                timelineProgress.style.transitionDuration = '1000ms';
            }, 1000);
        }
    }
    
    setupInteractiveElements() {
        // Add hover effects to cards - fix selector
        const cards = document.querySelectorAll('[class*="bg-white/90"]');
        cards.forEach(card => {
            card.classList.add('hover-lift');
            card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.15)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            });
        });
        
        // Add click handlers for buttons
        this.setupButtonHandlers();
    }
    
    setupButtonHandlers() {
        // Find buttons by text content instead of CSS selector
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.textContent.includes('CONTINUE QUEST')) {
                btn.addEventListener('click', () => {
                    this.showNotification('🎮 Loading quest details...', 'info');
                });
            }
            if (btn.textContent.includes('START BATTLE')) {
                btn.addEventListener('click', () => {
                    this.showNotification('⚔️ Initializing timeline battle...', 'success');
                });
            }
        });
    }
    
    startStreakAnimation() {
        // Fix selector for streak boxes
        const streakBoxes = document.querySelectorAll('.bg-purple-400.rounded-sm');
        streakBoxes.forEach((box, index) => {
            setTimeout(() => {
                box.style.animation = 'pulse 2s infinite';
                box.style.animationDelay = `${index * 0.1}s`;
            }, 1000 + (index * 200));
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-6 right-6 px-4 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
        
        const colors = {
            info: 'bg-blue-500 text-white',
            success: 'bg-green-500 text-white', 
            warning: 'bg-yellow-500 text-white'
        };
        
        notification.className += ` ${colors[type]}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i data-lucide="info" class="w-4 h-4"></i>
                <span class="text-sm font-semibold">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        lucide.createIcons();
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const moeBuddy = new MOEBuddy();
    const platform = new LearningPlatform();
    
    // Add quick action button handlers
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-action')) {
            const action = e.target.getAttribute('data-action');
            document.getElementById('chatInput').value = action;
            moeBuddy.sendMessage();
        }
    });
    
    // Add some interactive demo features
    setTimeout(() => {
        platform.showNotification('🎮 Welcome back, Quest Master Isaac! Ready to continue your Singapore Independence adventure?', 'info');
    }, 2000);
});

// This is now handled in the LearningPlatform setupButtonHandlers method
// Removed duplicate button handlers
