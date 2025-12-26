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
      // 代码质量规则 - 调整为警告而非错误
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_|^e$|^event$|^error$', // 忽略常见的事件参数
        varsIgnorePattern: '^_'
      }],
      'no-dupe-keys': 'warn', // 重复键改为警告（数据文件可能有重复）
      'no-empty': 'warn', // 空块改为警告（有时故意留空）
      'no-case-declarations': 'off', // 关闭 case 声明检查（常见模式）
      'no-redeclare': 'warn', // 重复声明改为警告
      'no-useless-escape': 'warn', // 无用转义改为警告
      'no-control-regex': 'warn', // 控制字符正则改为警告
      'no-misleading-character-class': 'warn', // 误导性字符类改为警告

      // 代码风格规则
      'no-console': 'off', // 允许 console（调试工具需要）
      'semi': ['error', 'always'], // 必须使用分号
      'quotes': ['warn', 'single', { avoidEscape: true }], // 推荐单引号
      'indent': 'off', // HTML 内联 JS 有额外缩进，不适用统一规则
      'no-undef': 'off' // 关闭未定义检查（HTML 中定义的函数）
    }
  }
];
