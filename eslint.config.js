import js from '@eslint/js';
import html from 'eslint-plugin-html';

export default [
  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**', '.git/**']
  },

  // Base config for all files
  js.configs.recommended,

  // HTML files configuration
  {
    files: ['**/*.html'],
    plugins: {
      html
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        FormData: 'readonly',
        Image: 'readonly',
        AudioContext: 'readonly',
        webkitAudioContext: 'readonly',
        MediaRecorder: 'readonly',
        RTCPeerConnection: 'readonly',
        AnalyserNode: 'readonly',
        performance: 'readonly',

        // Project-specific globals
        jsyaml: 'readonly',
        marked: 'readonly',
        DOMPurify: 'readonly',
        QRCode: 'readonly',
        Diff: 'readonly',
        CryptoJS: 'readonly',
        pinyinPro: 'readonly'
      }
    },
    rules: {
      // HTML 内联 JS 的函数通过 onclick 等属性调用，ESLint 无法识别
      // 直接关掉这些规则，避免大量误报
      'no-unused-vars': 'off',
      'no-undef': 'off',
      
      // 其他宽松规则
      'no-dupe-keys': 'off',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-case-declarations': 'off',
      'no-redeclare': 'off',
      'no-useless-escape': 'off',
      'no-control-regex': 'off',
      'no-misleading-character-class': 'off',
      'no-prototype-builtins': 'off',
      'no-console': 'off',
      'semi': 'off',
      'quotes': 'off',
      'indent': 'off'
    }
  }
];
