# Recraft Style Guide for Isaac's Academy

## 🎨 **Consistent Visual Style for All Generated Assets**

### **Color Palette**
- **Primary**: Blue-Purple gradient (#667EEA to #764BA2)
- **Accent Colors**: 
  - Soft Pink (#F093FB)
  - Light Blue (#4FACFE)
  - Warm Yellow (#FFD93D)
- **Background**: Deep blue-purple gradients
- **Text**: White on dark backgrounds

### **Art Style Keywords**
Always include these in prompts for consistency:

**Base Style**: `"modern digital illustration, clean vector style, glassmorphism, gradient backgrounds, professional educational design"`

**Color Instructions**: `"blue and purple gradient background, soft pink and light blue accents, modern UI colors"`

**Mood**: `"friendly, professional, educational, modern, clean, minimalist"`

### **Common Prompt Templates**

#### **Icons & Badges**
```bash
./recraft-generate.sh -p "modern educational icon, [SPECIFIC_ICON], clean vector style, glassmorphism effect, blue and purple gradient background, soft pink and light blue accents, professional UI design, minimalist, 3D subtle depth"
```

#### **Character Illustrations**
```bash
./recraft-generate.sh -p "friendly educational character, Singapore student, modern digital illustration, blue and purple gradient background, clean vector style, professional educational design, approachable, diverse, realistic proportions"
```

#### **Background Elements**
```bash
./recraft-generate.sh -p "abstract educational background, blue and purple gradients, geometric shapes, glassmorphism effects, modern UI design, subtle patterns, professional learning environment, clean minimalist style"
```

#### **Achievement Badges**
```bash
./recraft-generate.sh -p "educational achievement badge, [ACHIEVEMENT_NAME], modern vector style, blue and purple gradient background, golden accents, clean design, professional UI, glassmorphism, 3D subtle depth"
```

### **Specific Use Cases**

#### **Profile Avatar Enhancement**
```bash
./recraft-generate.sh -p "Singapore teenage student avatar, friendly educational portrait, modern digital illustration, blue and purple gradient background, clean vector style, professional, diverse representation, approachable smile"
```

#### **Subject Icons**
```bash
./recraft-generate.sh -p "Singapore history icon, modern educational symbol, clean vector style, blue and purple gradient background, glassmorphism effect, professional UI design, minimalist, cultural elements"
```

#### **Progress Indicators**
```bash
./recraft-generate.sh -p "educational progress indicator, modern UI element, blue and purple gradients, clean vector style, glassmorphism, professional design, learning journey visualization"
```

#### **Interactive Elements**
```bash
./recraft-generate.sh -p "educational game element, interactive UI component, modern vector style, blue and purple gradient background, soft pink accents, professional educational design, engaging, clean"
```

### **Quality Guidelines**
- **Resolution**: Always use 1024x1024 for square elements
- **Style Consistency**: Every prompt should include the base style keywords
- **Professional Tone**: Avoid overly cartoonish or childish elements
- **Educational Context**: Always reference learning/education in prompts
- **Cultural Sensitivity**: Include Singapore context where appropriate

### **Don'ts**
- Don't use bright neon colors that clash with the blue-purple theme
- Avoid overly complex or cluttered designs
- Don't use cartoon styles that look unprofessional
- Avoid colors outside the defined palette
- Don't create elements that look out of place with the clean UI

### **Testing New Elements**
Before generating final assets, test with:
```bash
./recraft-generate.sh -j -p "[YOUR_PROMPT]"
```
This shows only JSON output to verify the prompt works before generating images.

### **File Organization**
- Save all generated images in: `./generated_images/`
- Use descriptive filenames with the element type
- Keep the style guide updated with successful prompts
