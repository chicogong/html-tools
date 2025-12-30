/**
 * Internationalization (i18n) module for HTML Tools
 * Supports multiple languages with localStorage persistence
 */

const I18N = {
    currentLang: 'zh-CN',
    translations: {},
    supportedLangs: ['zh-CN', 'en'],
    
    /**
     * Initialize i18n with translations
     */
    async init() {
        // Get saved language or detect from browser
        const savedLang = localStorage.getItem('lang');
        const browserLang = navigator.language;
        
        if (savedLang && this.supportedLangs.includes(savedLang)) {
            this.currentLang = savedLang;
        } else if (browserLang.startsWith('en')) {
            this.currentLang = 'en';
        } else {
            this.currentLang = 'zh-CN';
        }
        
        // Load translations
        await this.loadTranslations();
        
        return this;
    },
    
    /**
     * Load translation files
     */
    async loadTranslations() {
        try {
            // For local file loading, embed translations directly
            this.translations = {
                'zh-CN': {
                    lang: 'zh-CN',
                    name: '简体中文',
                    ui: {
                        title: '在线工具集',
                        subtitle: '700+ 纯前端在线工具',
                        search: '搜索工具...',
                        categories: '分类',
                        all: '全部',
                        tools: '工具',
                        home: '首页',
                        noResults: '没有找到匹配的工具',
                        loading: '加载中...',
                        darkMode: '深色模式',
                        lightMode: '浅色模式',
                        language: '语言',
                        backToTop: '返回顶部',
                        footer: '纯前端工具，无需服务器，保护隐私'
                    },
                    categories: {
                        dev: '开发工具',
                        text: '文本工具',
                        time: '时间工具',
                        generator: '生成器',
                        media: '媒体工具',
                        privacy: '隐私安全',
                        security: '安全工具',
                        network: '网络工具',
                        calculator: '计算器',
                        converter: '转换器',
                        extractor: '提取器',
                        ai: 'AI 工具',
                        life: '生活工具',
                        seo: 'SEO 工具',
                        fun: '趣味工具',
                        game: '小游戏',
                        finance: '财务工具',
                        health: '医疗健康',
                        education: '教育学习',
                        food: '餐饮食品',
                        chinese: '中文工具',
                        'ai-coding': 'AI 编程',
                        property: '房产工具',
                        business: '商业工具',
                        crypto: '加密货币'
                    }
                },
                'en': {
                    lang: 'en',
                    name: 'English',
                    ui: {
                        title: 'Online Tools',
                        subtitle: '700+ Pure Frontend Online Tools',
                        search: 'Search tools...',
                        categories: 'Categories',
                        all: 'All',
                        tools: 'Tools',
                        home: 'Home',
                        noResults: 'No matching tools found',
                        loading: 'Loading...',
                        darkMode: 'Dark Mode',
                        lightMode: 'Light Mode',
                        language: 'Language',
                        backToTop: 'Back to Top',
                        footer: 'Pure frontend tools, no server required, privacy protected'
                    },
                    categories: {
                        dev: 'Developer Tools',
                        text: 'Text Tools',
                        time: 'Time Tools',
                        generator: 'Generators',
                        media: 'Media Tools',
                        privacy: 'Privacy & Security',
                        security: 'Security Tools',
                        network: 'Network Tools',
                        calculator: 'Calculators',
                        converter: 'Converters',
                        extractor: 'Extractors',
                        ai: 'AI Tools',
                        life: 'Lifestyle',
                        seo: 'SEO Tools',
                        fun: 'Fun & Games',
                        game: 'Games',
                        finance: 'Finance',
                        health: 'Health',
                        education: 'Education',
                        food: 'Food & Drink',
                        chinese: 'Chinese Tools',
                        'ai-coding': 'AI Coding',
                        property: 'Real Estate',
                        business: 'Business',
                        crypto: 'Cryptocurrency'
                    }
                }
            };
        } catch (e) {
            console.error('Failed to load translations:', e);
        }
    },
    
    /**
     * Get translation by key
     * @param {string} key - Dot notation key (e.g., 'ui.title')
     * @param {string} [fallback] - Fallback value if key not found
     */
    t(key, fallback = '') {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fallback || key;
            }
        }
        
        return value || fallback || key;
    },
    
    /**
     * Set language
     * @param {string} lang - Language code
     */
    setLang(lang) {
        if (this.supportedLangs.includes(lang)) {
            this.currentLang = lang;
            localStorage.setItem('lang', lang);
            document.documentElement.lang = lang;
            return true;
        }
        return false;
    },
    
    /**
     * Get current language
     */
    getLang() {
        return this.currentLang;
    },
    
    /**
     * Get all supported languages
     */
    getSupportedLangs() {
        return this.supportedLangs.map(lang => ({
            code: lang,
            name: this.translations[lang]?.name || lang
        }));
    }
};

// Export for module usage or attach to window
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18N;
} else if (typeof window !== 'undefined') {
    window.I18N = I18N;
}
