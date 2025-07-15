// postcss.config.js - Конфигурация PostCSS для ГК БИЗНЕС РЕШЕНИЕ
// Путь: postcss.config.js

export default {
  plugins: {
    // Импорт CSS файлов
    'postcss-import': {},
    
    // TailwindCSS - основная CSS-система
    tailwindcss: {},
    
    // Автопрефиксы для кроссбраузерности
    autoprefixer: {},
    
    // Минификация в продакшене
    ...(process.env.NODE_ENV === 'production' 
      ? { 
          cssnano: {
            preset: [
              'default',
              {
                // Настройки минификации
                discardComments: {
                  removeAll: true,
                },
                normalizeWhitespace: true,
                colormin: true,
                convertValues: true,
                discardDuplicates: true,
                discardEmpty: true,
                mergeLonghand: true,
                mergeRules: true,
                minifyFontValues: true,
                minifyGradients: true,
                minifyParams: true,
                minifySelectors: true,
                normalizeCharset: true,
                normalizeDisplayValues: true,
                normalizePositions: true,
                normalizeRepeatStyle: true,
                normalizeString: true,
                normalizeTimingFunctions: true,
                normalizeUnicode: true,
                normalizeUrl: true,
                orderedValues: true,
                reduceIdents: true,
                reduceInitial: true,
                reduceTransforms: true,
                svgo: true,
                uniqueSelectors: true,
              },
            ],
          }
        } 
      : {}
    ),
  },
}