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
      // ========== HTML 内联 JS 特殊处理 ==========
      // 本项目的函数定义在 <script> 中，通过 onclick/onchange 等 HTML 属性调用
      // ESLint 只分析 JS 代码，无法追踪 HTML 属性中的函数调用，导致大量误报
      // 例如：function copyResult() {} 会被报 "defined but never used"
      //       但实际通过 <button onclick="copyResult()"> 调用
      'no-unused-vars': 'off',
      'no-undef': 'off',
      
      // ========== 项目特性相关 ==========
      'no-dupe-keys': 'off',              // 工具数据中可能有重复键
      'no-empty': ['warn', { allowEmptyCatch: true }],  // 允许空 catch 块
      'no-case-declarations': 'off',       // switch case 中声明变量是常见模式
      'no-redeclare': 'off',               // 某些工具需要条件性重声明
      'no-useless-escape': 'off',          // 正则表达式工具需要各种转义
      'no-control-regex': 'off',           // 文本处理工具需要匹配控制字符
      'no-misleading-character-class': 'off',
      'no-prototype-builtins': 'off',      // hasOwnProperty 等直接调用
      
      // ========== 代码风格（不强制）==========
      'no-console': 'off',                 // 允许 console 调试
      'semi': 'off',                       // 分号风格不限
      'quotes': 'off',                     // 引号风格不限
      'indent': 'off'                      // HTML 内嵌 JS 缩进特殊，不检查
    }
  }
];
