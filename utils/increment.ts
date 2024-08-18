export default function incrementValue(
  value: number,
  increment: number
): number {
  let result = parseInt(value.toString());
  if (!isNaN(result)) {
    // Ensure the current value is a valid number
    result = result + increment; // Add 10 to the current value
  } else {
    result = increment; // If the input is empty or not a number, set it to 10
  }
  return result;
}
