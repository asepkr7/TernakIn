export function generateRandomNumber(number) {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
  return `${number}${randomNumber}`;
}
