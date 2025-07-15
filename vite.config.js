// vite.config.js - Конфигурация Vite для GKBR Platform
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🛣️ АЛИАСЫ ПУТЕЙ
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@platform': resolve(__dirname, 'src/platform'),
      '@blocks': resolve(__dirname, 'src/blocks'),
      '@content': resolve(__dirname, 'src/content'),
      '@admin': resolve(__dirname, 'src/admin'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@api': resolve(__dirname, 'src/api'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@integrations': resolve(__dirname, 'src/integrations'),
      '@hr_engine': resolve(__dirname, 'src/hr_engine'),
      '@premium': resolve(__dirname, 'src/components/premium')
    }
  },

  // 📂 ДИРЕКТОРИИ
  root: '.',
  publicDir: 'public',
  
  // 🏗️ НАСТРОЙКИ СБОРКИ
  build: {
    outDir: 'dist',
    sourcemap: false, // Отключаем для production
    minify: 'terser',
    target: 'es2015',
    cssTarget: 'chrome80',
    
    // 📦 Оптимизация чанков
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          // Разделяем вендорские библиотеки
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // Премиальные компоненты в отдельный чанк
          premium: [
            './src/components/premium/PremiumTheme.jsx',
            './src/components/premium/DesignSystem.jsx',
            './src/components/premium/SoundSystem.jsx',
            './src/components/premium/VisualEffects.jsx',
            './src/components/premium/InteractiveElements.jsx',
            './src/components/premium/AnimatedComponents.jsx',
            './src/components/premium/LoadingStates.jsx',
            './src/components/premium/AnimatedBackground.jsx',
            './src/components/premium/MicroAnimations.jsx',
            './src/components/premium/PremiumUI.jsx'
          ],
          
          // API в отдельный чанк
          api: [
            './src/api/mockContentApi.js',
            './src/api/mockProgressApi.js',
            './src/api/mockAuthApi.js'
          ]
        },
        
        // 📝 Именование чанков
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').at(1)
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/css/i.test(extType)) {
            return `assets/css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    },
    
    // 🔧 Терминал минификации
    terserOptions: {
      compress: {
        drop_console: true, // Удаляем console.log в production
        drop_debugger: true
      }
    },
    
    // 📏 Размеры чанков
    chunkSizeWarningLimit: 1600,
    
    // 🎯 Оптимизации
    cssCodeSplit: true,
    reportCompressedSize: false,
    
    // 🔗 Ассеты
    assetsInlineLimit: 4096 // 4kb
  },

  // 🖥️ НАСТРОЙКИ DEV СЕРВЕРА
  server: {
    port: 5173,
    host: true, // Позволяет доступ извне
    open: true, // Автоматически открывает браузер
    cors: true,
    
    // 🔄 Hot Module Replacement
    hmr: {
      overlay: true
    },
    
    // 🛡️ Заголовки безопасности для разработки
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },

  // 👀 НАСТРОЙКИ PREVIEW
  preview: {
    port: 3001,
    host: true,
    open: true,
    cors: true
  },

  // 🎨 CSS НАСТРОЙКИ
  css: {
    postcss: './postcss.config.js',
    
    // 🔧 Препроцессоры
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    },
    
    // 📦 CSS модули
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    
    // ⚡ Code splitting для CSS
    devSourcemap: true
  },

  // 🔧 ОПТИМИЗАЦИИ
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    exclude: [
      'fsevents'
    ]
  },

  // 🌍 ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },

  // 📊 ESBuild настройки
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    legalComments: 'none'
  },

  // 🔄 Watcher опции
  watch: {
    ignored: [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/coverage/**'
    ]
  },

  // 🧪 ТЕСТОВЫЕ НАСТРОЙКИ
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true
  },

  // 📝 ЛОГИРОВАНИЕ
  logLevel: 'info',
  clearScreen: false,

  // 🔌 ПЛАГИНЫ КОНФИГУРАЦИЯ
  experimental: {
    hmrPartialAccept: true
  }
})