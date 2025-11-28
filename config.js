// Configuration loader - secure for both local and production
class ConfigLoader {
  static async loadConfig() {
    // Try different sources in order of preference
    
    // 1. Try production environment (Vercel build-time injection)
    if (window.ENV?.OPENROUTER_API_KEY && window.ENV.OPENROUTER_API_KEY !== '{{OPENROUTER_API_KEY}}') {
      return { OPENROUTER_API_KEY: window.ENV.OPENROUTER_API_KEY };
    }
    
    // 2. Try local config file (development only)
    try {
      const localConfig = await import('./config.local.js');
      if (localConfig.default?.OPENROUTER_API_KEY) {
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
    
    throw new Error('No API key configured');
  }
}

window.ConfigLoader = ConfigLoader;