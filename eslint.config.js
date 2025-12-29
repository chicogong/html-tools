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
      // 代码质量规则 - 针对单文件工具的特殊情况进行调整
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_|^e$|^event$|^error$|^err$|^i$|^x$|^y$', // 忽略常见的参数名
        varsIgnorePattern: '^_', // 忽略 _ 开头的变量（表示有意不使用）
        caughtErrorsIgnorePattern: '^_|^e$|^err$|^error$',
        destructuredArrayIgnorePattern: '^_' // 忽略解构中的 _
      }],
      'no-dupe-keys': 'off', // 关闭重复键检查（工具数据文件中可能有重复，不影响功能）
      'no-empty': ['warn', { allowEmptyCatch: true }], // 空块改为警告，允许空 catch
      'no-case-declarations': 'off', // 关闭 case 声明检查（常见模式）
      'no-redeclare': 'warn', // 重复声明改为警告（某些工具有意重复声明）
      'no-useless-escape': 'off', // 关闭无用转义检查（正则表达式工具需要）
      'no-control-regex': 'off', // 关闭控制字符检查（文本处理工具需要）
      'no-misleading-character-class': 'off', // 关闭误导性字符类检查
      'no-prototype-builtins': 'warn', // Object.prototype 方法改为警告

      // 代码风格规则
      'no-console': 'off', // 允许 console（调试和日志需要）
      'semi': 'off', // 关闭分号检查（自动格式化会处理）
      'quotes': 'off', // 关闭引号检查（允许混合使用）
      'indent': 'off', // HTML 内联 JS 有额外缩进，不适用统一规则
      'no-undef': 'off' // 关闭未定义检查（HTML onclick 等属性中定义的函数）
    }
  }
];
