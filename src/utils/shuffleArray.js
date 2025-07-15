// shuffleArray.js - Утилита для перемешивания массивов
// Путь: src/utils/shuffleArray.js

/**
 * Перемешивает элементы массива случайным образом (алгоритм Фишера-Йетса)
 * @param {Array} array - Исходный массив
 * @returns {Array} - Новый перемешанный массив
 */
export const shuffleArray = (array) => {
  if (!Array.isArray(array)) {
    console.warn('shuffleArray: Передан не массив:', array)
    return []
  }

  // Создаем копию массива, чтобы не изменять оригинал
  const shuffled = [...array]
  
  // Алгоритм Фишера-Йетса
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

/**
 * Перемешивает несколько массивов с сохранением соответствия элементов
 * @param {Array[]} arrays - Массив массивов для перемешивания
 * @returns {Array[]} - Массив перемешанных массивов
 */
export const shuffleMultipleArrays = (...arrays) => {
  if (arrays.length === 0) return []
  
  const length = arrays[0].length
  
  // Проверяем, что все массивы одинаковой длины
  if (!arrays.every(arr => arr.length === length)) {
    console.warn('shuffleMultipleArrays: Массивы должны быть одинаковой длины')
    return arrays
  }
  
  // Создаем индексы для перемешивания
  const indices = Array.from({ length }, (_, i) => i)
  const shuffledIndices = shuffleArray(indices)
  
  // Применяем перемешивание ко всем массивам
  return arrays.map(array => 
    shuffledIndices.map(index => array[index])
  )
}

/**
 * Случайно выбирает N элементов из массива
 * @param {Array} array - Исходный массив
 * @param {number} count - Количество элементов для выбора
 * @returns {Array} - Массив случайно выбранных элементов
 */
export const getRandomElements = (array, count) => {
  if (!Array.isArray(array) || count <= 0) return []
  
  const shuffled = shuffleArray(array)
  return shuffled.slice(0, Math.min(count, array.length))
}

export default shuffleArray