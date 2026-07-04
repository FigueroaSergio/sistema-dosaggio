import { Recipe, RecipeRegistry } from "../composables/useRecipes";
import { HistoryEntry } from "../composables/useHistory";

export function parseCSVToRecipes(csvContent: string): Recipe[] {
  const lines = csvContent.split("\n").filter((line) => line.trim());
  const recipesMap: Record<string, Recipe> = {};

  // Skip header if present (assuming header has "Ricetta" or starts with non-data)
  let startIndex = 0;
  if (lines.length > 0 && lines[0].toLowerCase().includes("ricetta")) {
    startIndex = 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(";").map((p) => p.trim());
    if (parts.length < 4) continue; // Skip invalid lines

    const recipeName = parts[0];
    const ingredientName = parts[1];
    // const orderStr = parts[2]; // not used
    const quantityStr = parts[3];
    const toleranceStr = parts.length > 4 ? parts[4] : "0";

    const quantity = parseFloat(quantityStr.replace(",", "."));
    const tolerance = parseFloat(toleranceStr.replace(",", "."));

    if (!recipesMap[recipeName]) {
      recipesMap[recipeName] = {
        name: recipeName,
        ingredients: [],
        note: "",
      };
    }

    recipesMap[recipeName].ingredients.push({
      name: ingredientName,
      grams: quantity,
      tolerance: isNaN(tolerance) ? 0 : tolerance,
    });
  }

  return Object.values(recipesMap);
}

export function exportRecipesToCSV(recipes: RecipeRegistry): string {
  let csvContent = "Ricetta;Ingrediente;#;Quantita;Tolleranza\n";

  Object.values(recipes).forEach((recipe) => {
    recipe.ingredients.forEach((ingredient, index) => {
      const quantity = (ingredient.grams || 0).toFixed(3).replace(".", ",");
      const tolerance = (ingredient.tolerance || 0)
        .toFixed(3)
        .replace(".", ",");
      csvContent += `${recipe.name};${ingredient.name};${index + 1};${quantity};${tolerance}\n`;
    });
  });

  return csvContent;
}

export function exportHistoryToCSV(history: HistoryEntry[]): string {
  let csvContent = "Data;Ricetta;Ingrediente;Grammi;Tolleranza;Peso Reale;Tara\n";

  history.forEach((entry) => {
    const dateStr = new Date(entry.timestamp).toLocaleString();
    entry.preparation.ingredients.forEach((ing) => {
      const grams = (ing.grams || 0).toFixed(3).replace(".", ",");
      const tolerance = (ing.tolerance || 0).toFixed(3).replace(".", ",");
      const weight = (ing.weight || 0).toFixed(3).replace(".", ",");
      const tare = (entry.preparation.tareWeight || 0).toFixed(3).replace(".", ",");
      csvContent += `${dateStr};${entry.preparation.name};${ing.name};${grams};${tolerance};${weight};${tare}\n`;
    });
  });

  return csvContent;
}
