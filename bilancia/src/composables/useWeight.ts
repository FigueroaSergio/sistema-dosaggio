import { ref, onMounted, Ref } from "vue";
export function useWeight(active: Ref<Boolean>) {
  let buffer = ref<string>("");
  let weight = ref<number>(0);
  const SCALE_PATTERN = /^(\d*|0)\d+$/;

  function update(event: KeyboardEvent) {
    console.log(event);

    if (!active.value) {
      return;
    }
    if (event.key !== "Enter") {
      if (
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        buffer.value += event.key;
        return;
      }
    }

    const finalReading = buffer.value.trim();
    buffer.value = "";
    console.log(finalReading);

    if (finalReading && SCALE_PATTERN.test(finalReading)) {
      let newWeightKgString = finalReading;
      const numericWeightKg = parseFloat(newWeightKgString.replace(",", "."));

      if (!isNaN(numericWeightKg)) {
        // Convertir Kg a Gramos para la lógica interna
        const newWeightGrams = numericWeightKg * 1;

        weight.value = newWeightGrams;
      }
    } else {
      console.warn(
        `[Scale Input] Lettura bilancia non valida o vuota: "${finalReading}". Il formato atteso è "X,XX" (in Kg).`,
      );
    }
  }
  onMounted(() => window.addEventListener("keydown", update));
  return { weight };
}
