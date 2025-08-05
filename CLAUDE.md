# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Isaac's Learning Hub" - an educational web application focused on Singapore History learning for secondary school students. It's a client-side HTML/CSS/JavaScript application that features an AI-powered learning assistant called "MOE Buddy" that helps students with their studies.

## Development Commands

Since this is a static HTML/CSS/JavaScript project, there are no build commands, test frameworks, or package managers configured. Development is done by:

1. **Local Development**: Open `index.html` directly in a browser or use a simple HTTP server
2. **File Structure**: Edit HTML in `index.html`, styles in `css/styles.css`, and JavaScript in `js/app.js`
3. **Testing**: Manual testing in browser - no automated testing framework configured

## Architecture

### Core Components

- **MOEBuddy Class** (`js/app.js:3-203`): Manages the AI chat interface and OpenRouter API integration
  - Handles chat UI interactions and message display
  - Integrates with OpenRouter API using GPT-4o-mini model
  - Contains detailed system prompt for Singapore History tutoring context
  
- **LearningPlatform Class** (`js/app.js:206-317`): Manages the dashboard UI and interactive elements
  - Handles progress animations and visual effects
  - Manages notification system and user interactions
  - Controls hover effects and button behaviors

### Key Files

- `index.html`: Main application interface with dashboard, progress tracking, and chat panel
- `js/app.js`: Contains all application logic split into MOEBuddy and LearningPlatform classes
- `css/styles.css`: ITCSS-structured styles with custom animations and responsive design
- `prompts/isaac-buddy-system.md`: Detailed prompt engineering documentation for the AI assistant

### External Dependencies

- **Tailwind CSS**: Loaded via CDN for styling framework
- **Lucide Icons**: Loaded via CDN for iconography
- **Google Fonts (Nunito)**: Custom typography
- **OpenRouter API**: AI chat functionality using GPT-4o-mini model

### API Integration

The application integrates with OpenRouter API for AI chat functionality. The API key is currently hardcoded in `js/app.js:14` (this should be moved to environment variables in production).

### Educational Context

The application is specifically designed for Isaac Chen, a 14-year-old analytical student studying Singapore's path to independence. The AI assistant uses detailed contextual prompts about Singapore history, learning preferences, and educational goals.

## Important Notes

- **Security**: API key is exposed in client-side code - should be moved to server-side in production
- **No Backend**: This is a purely client-side application with no server-side components
- **Educational Focus**: Content and AI prompts are specifically tailored for Singapore Secondary 2 History curriculum