export const currendyFormatter = (value: number) => {
  return value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  })
}