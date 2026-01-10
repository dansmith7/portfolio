// Расчет расстояния от верха первой строки текста до низа кнопки Telegram

// Текст описания
const descFontSize = 20; // px
const descLineHeight = 1.6;
const descMarginBottom = 60; // px
const descFirstLineHeight = descFontSize * descLineHeight; // 32px

// Первый contact-info-item (EMAIL)
const labelFontSize = 12; // px
const labelMarginBottom = 4; // px
const labelHeight = labelFontSize + labelMarginBottom; // ~16px

const buttonPaddingTop = 12; // px
const buttonPaddingBottom = 12; // px
const buttonFontSize = 16; // px
const buttonHeight = buttonPaddingTop + buttonFontSize + buttonPaddingBottom; // ~40px

const itemGap = 8; // px между label и button
const firstItemHeight = labelHeight + itemGap + buttonHeight; // ~64px

// Gap между двумя items
const itemsGap = 40; // px

// Второй contact-info-item (TELEGRAM)
const secondItemHeight = labelHeight + itemGap + buttonHeight; // ~64px

// Итого расстояние от верха первой строки описания
// (берем только верх первой строки, не всю высоту текста, если он многострочный)
const totalDistance = descFirstLineHeight + descMarginBottom + firstItemHeight + itemsGap + secondItemHeight;

console.log('Расчет расстояния:');
console.log('- Высота первой строки текста описания:', descFirstLineHeight, 'px');
console.log('- Отступ снизу описания:', descMarginBottom, 'px');
console.log('- Высота первого контакта (EMAIL):', firstItemHeight, 'px');
console.log('- Отступ между контактами:', itemsGap, 'px');
console.log('- Высота второго контакта (TELEGRAM):', secondItemHeight, 'px');
console.log('');
console.log('ИТОГО расстояние от верха первой строки текста до низа кнопки Telegram:', totalDistance, 'px');
