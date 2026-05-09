import { Schema } from "../utils/Validator";

export const RecipeValidator = Schema.object().define({
  name: Schema.string().trim(),
  ingredients: Schema.array()
    .min(1)
    .of(
      Schema.object().define({
        name: Schema.string().trim(),
        grams: Schema.number().min(1),
        tolerance: Schema.number().min(0),
      }),
    ),
});
