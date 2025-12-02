// Configuration loader - secure for both local and production
// Priority order:
// 1. window.ENV (injected by server.js from .env file)
// 2. config.local.js (local development fallback - not committed to git)
// 3. sessionStorage (user-provided key)
// 4. Prompt user (last resort)
class ConfigLoader {
  static async loadConfig() {
    // Try different sources in order of preference
    
    // 1. Try environment variables injected by server (from .env file)
    if (window.ENV?.OPENROUTER_API_KEY) {
      const apiKey = window.ENV.OPENROUTER_API_KEY;
      // Check if it's a placeholder or empty
      if (apiKey && 
          apiKey !== '{{OPENROUTER_API_KEY}}' && 
          typeof apiKey === 'string' && 
          apiKey.trim() !== '') {
        console.log('✅ Using API key from server environment');
        return { OPENROUTER_API_KEY: apiKey.trim() };
      } else {
        console.warn('⚠️ window.ENV.OPENROUTER_API_KEY exists but is empty or placeholder');
      }
    } else {
      console.warn('⚠️ window.ENV not found - make sure you are accessing via the Node.js server (http://localhost:8000) not file://');
    }
    
    // 2. Try local config file (development only - should not exist in production)
    try {
      const localConfig = await import('/js/config.local.js');
      if (localConfig.default?.OPENROUTER_API_KEY) {
        console.warn('⚠️ Using config.local.js - consider using .env file instead');
        return localConfig.default;
      }
    } catch (e) {
      // config.local.js doesn't exist - that's fine
    }
    
    // 3. Check sessionStorage for user-provided key
    const storedKey = sessionStorage.getItem('openrouter_api_key');
    if (storedKey) {
      return { OPENROUTER_API_KEY: storedKey };
    }
    
    // 4. Prompt user for API key (last resort)
    const userKey = prompt(
      'Please enter your OpenRouter API Key:\n' +
      '(This will be stored in session storage only)\n' +
      'Get your key from: https://openrouter.ai/keys'
    );
    
    if (userKey) {
      sessionStorage.setItem('openrouter_api_key', userKey);
      return { OPENROUTER_API_KEY: userKey };
    }
    
    throw new Error('No API key configured. Please set OPENROUTER_API_KEY in .env file or provide it when prompted.');
  }
}

window.ConfigLoader = ConfigLoader;

