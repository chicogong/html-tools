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
        CryptoJS: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'indent': 'off', // HTML 内联 JS 有额外缩进，不适用统一规则
      'no-undef': 'off'
    }
  }
];
