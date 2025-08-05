// Isaac's Learning Platform - Main App Logic

class MOEBuddy {
    constructor() {
        this.apiKey = null;
        this.chatMessages = [];
        this.isOpen = false;
        
        this.init();
    }
    
    async init() {
        // Load API key (in production, this would be handled server-side)
        this.apiKey = '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';
        
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
        const welcomeMsg = {
            role: 'assistant',
            content: "Hi Isaac! I noticed you're studying the PAP formation. Want me to find some primary source documents about Singapore's political landscape in 1954?"
        };
        this.chatMessages.push(welcomeMsg);
    }
    
    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessageToChat(message, 'user');
        input.value = '';
        
        // Show thinking indicator
        this.showThinking();
        
        try {
            const response = await this.getAIResponse(message);
            this.hideThinking();
            this.addMessageToChat(response, 'assistant');
        } catch (error) {
            this.hideThinking();
            this.addMessageToChat("Sorry Isaac, I'm having trouble connecting right now. Try asking again in a moment!", 'assistant');
        }
    }
    
    addMessageToChat(message, role) {
        const chatContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        
        if (role === 'user') {
            messageDiv.className = 'bg-blue-500 text-white rounded-2xl p-3 mb-3 ml-8 buddy-chat-bubble';
            messageDiv.style.textAlign = 'right';
        } else {
            messageDiv.className = 'bg-blue-50 rounded-2xl p-3 mb-3 mr-8 buddy-chat-bubble';
        }
        
        messageDiv.innerHTML = `<p class="text-sm">${message}</p>`;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Add to messages array
        this.chatMessages.push({ role, content: message });
    }
    
    showThinking() {
        const chatContainer = document.getElementById('chatMessages');
        const thinkingDiv = document.createElement('div');
        thinkingDiv.id = 'thinking-indicator';
        thinkingDiv.className = 'bg-gray-100 rounded-2xl p-3 mb-3 mr-8';
        thinkingDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-xs text-gray-500">MOE Buddy is thinking...</span>
            </div>
        `;
        chatContainer.appendChild(thinkingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    hideThinking() {
        const thinkingIndicator = document.getElementById('thinking-indicator');
        if (thinkingIndicator) {
            thinkingIndicator.remove();
        }
    }
    
    async getAIResponse(userMessage) {
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
                        content: `You are MOE Buddy, a friendly AI learning assistant for Isaac Chen, a 14-year-old analytical student in Singapore studying Secondary 2 History.

ISAAC'S PROFILE:
- Highly analytical and methodical
- Visual and kinesthetic learner  
- Prefers reading/writing activities
- Works best independently
- Enjoys detailed timelines and cause-effect relationships
- Currently studying Singapore's path to independence

CURRENT LESSON CONTEXT:
- Topic: Nationalism & Self-Government
- Focus: People's Action Party Formation (1954)
- Learning stage: During lesson phase
- Has completed pre-assessment showing good foundational knowledge

YOUR PERSONALITY:
- Friendly but professional tone
- Use Isaac's name occasionally
- Encourage analytical thinking
- Provide structured, detailed responses
- Reference specific historical facts and dates
- Suggest primary sources and deeper exploration
- Keep responses concise but informative (2-3 sentences max)

ADAPTIVE FEATURES TO REFERENCE:
- Personalized timeline activities
- Primary source document suggestions  
- Cause-and-effect analysis tools
- Self-paced learning modules
- Progress tracking and badges

SINGAPORE CONTEXT:
- Use Singapore spelling and context
- Reference local historical sites and figures
- Mention connections to present-day Singapore when relevant

Respond as MOE Buddy would to Isaac's question about Singapore History.`
                    },
                    ...this.chatMessages.slice(-5), // Keep last 5 messages for context
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 150
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
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
            if (btn.textContent.includes('Continue Reading')) {
                btn.addEventListener('click', () => {
                    this.showNotification('Opening detailed lesson content...', 'info');
                });
            }
            if (btn.textContent.includes('Start Assessment')) {
                btn.addEventListener('click', () => {
                    this.showNotification('Loading timeline drag & drop activity...', 'success');
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
    
    // Add some interactive demo features
    setTimeout(() => {
        platform.showNotification('Welcome back, Isaac! Ready to continue your Singapore History journey?', 'info');
    }, 2000);
});

// This is now handled in the LearningPlatform setupButtonHandlers method
// Removed duplicate button handlers
