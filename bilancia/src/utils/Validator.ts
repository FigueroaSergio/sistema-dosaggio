interface ValidationErrorDetail {
  path: string;
  message: string;
  code?: string;
  value?: any;
}

class ValidationError extends Array<ValidationErrorDetail> {
  constructor(errors: ValidationErrorDetail[] = []) {
    super(...errors);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  getByPath(path: string): ValidationErrorDetail[] {
    return this.filter((e) => e.path === path);
  }

  getByField(field: string): ValidationErrorDetail[] {
    return this.filter((e) => e.path.includes(field));
  }

  getMap(): Record<string, string[]> {
    const map: Record<string, string[]> = {};
    for (const error of this) {
      if (!map[error.path]) {
        map[error.path] = [];
      }
      map[error.path].push(error.message);
    }
    return map;
  }

  first(path?: string): ValidationErrorDetail | undefined {
    if (path) {
      return this.find((e) => e.path === path);
    }
    return this[0];
  }

  toString(): string {
    return this.map((e) => `${e.path}: ${e.message}`).join("\n");
  }
}

class ValidationResult<T> {
  constructor(
    private data: T | null,
    private errors: ValidationError,
  ) {}

  isValid(): boolean {
    return this.errors.length === 0;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getData(): T | null {
    return this.data;
  }

  getErrors(): ValidationError {
    return this.errors;
  }

  getErrorMap(): Record<string, string[]> {
    return this.errors.getMap();
  }

  getFirstError(path?: string): ValidationErrorDetail | undefined {
    return this.errors.first(path);
  }

  getErrorsByPath(path: string): ValidationErrorDetail[] {
    return this.errors.getByPath(path);
  }

  getErrorsByField(field: string): ValidationErrorDetail[] {
    return this.errors.getByField(field);
  }

  throw(): T {
    if (!this.isValid()) {
      const error = new Error(this.errors.toString());
      (error as any).errors = this.errors;
      throw error;
    }
    return this.data!;
  }

  toString(): string {
    return this.errors.toString();
  }
}

abstract class BaseValidator<T> {
  protected rules: Array<(value: any, path: string) => string | null> = [];
  protected _optional: boolean = false;
  protected defaultValue: any = undefined;
  protected customErrorMessage?: string;
  protected customErrorCode?: string;

  abstract parse(value: any): T;

  validate(value: any, path: string = "root"): ValidationResult<T> {
    const errors: ValidationErrorDetail[] = [];

    if (value === undefined || value === null) {
      if (this._optional) {
        return new ValidationResult<T>(
          this.defaultValue ?? value,
          new ValidationError([]),
        );
      }
      errors.push({
        path,
        message: this.customErrorMessage || "Value is required",
        code: this.customErrorCode || "REQUIRED",
        value,
      });
      return new ValidationResult<T>(null, new ValidationError(errors));
    }

    try {
      const parsed = this.parse(value);

      for (const rule of this.rules) {
        const error = rule(parsed, path);
        if (error) {
          errors.push({
            path,
            message: error,
            value: parsed,
          });
        }
      }

      if (errors.length > 0) {
        return new ValidationResult<T>(null, new ValidationError(errors));
      }

      return new ValidationResult<T>(parsed, new ValidationError([]));
    } catch (error) {
      errors.push({
        path,
        message: this.customErrorMessage || String(error),
        code: this.customErrorCode || "PARSE_ERROR",
        value,
      });
      return new ValidationResult<T>(null, new ValidationError(errors));
    }
  }

  required(): this {
    this._optional = false;
    return this;
  }

  optional(defaultValue?: T): this {
    this._optional = true;
    this.defaultValue = defaultValue;
    return this;
  }

  error(message: string, code?: string): this {
    this.customErrorMessage = message;
    this.customErrorCode = code;
    return this;
  }
}

// String Validator
class StringValidator extends BaseValidator<string> {
  parse(value: any): string {
    if (typeof value !== "string") {
      throw new Error("Expected string");
    }
    return value;
  }

  min(length: number): this {
    this.rules.push((value, path) => {
      if (value.length < length) {
        return `String must be at least ${length} characters`;
      }
      return null;
    });
    return this;
  }

  max(length: number): this {
    this.rules.push((value, path) => {
      if (value.length > length) {
        return `String must be at most ${length} characters`;
      }
      return null;
    });
    return this;
  }

  email(): this {
    this.rules.push((value, path) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Invalid email format";
      }
      return null;
    });
    return this;
  }

  pattern(regex: RegExp, message?: string): this {
    this.rules.push((value, path) => {
      if (!regex.test(value)) {
        return message || `Value does not match pattern ${regex}`;
      }
      return null;
    });
    return this;
  }

  trim(): this {
    this.rules.push((value, path) => {
      if (value.trim().length === 0) {
        return "String cannot be empty after trimming";
      }
      return null;
    });
    return this;
  }

  oneOf(values: string[]): this {
    this.rules.push((value, path) => {
      if (!values.includes(value)) {
        return `Value must be one of: ${values.join(", ")}`;
      }
      return null;
    });
    return this;
  }
}

// Number Validator
class NumberValidator extends BaseValidator<number> {
  parse(value: any): number {
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error("Expected number");
    }
    return num;
  }

  min(value: number): this {
    this.rules.push((num, path) => {
      if (num < value) {
        return `Number must be at least ${value}`;
      }
      return null;
    });
    return this;
  }

  max(value: number): this {
    this.rules.push((num, path) => {
      if (num > value) {
        return `Number must be at most ${value}`;
      }
      return null;
    });
    return this;
  }

  positive(): this {
    this.rules.push((num, path) => {
      if (num <= 0) {
        return "Number must be positive";
      }
      return null;
    });
    return this;
  }

  int(): this {
    this.rules.push((num, path) => {
      if (!Number.isInteger(num)) {
        return "Number must be an integer";
      }
      return null;
    });
    return this;
  }

  oneOf(values: number[]): this {
    this.rules.push((num, path) => {
      if (!values.includes(num)) {
        return `Value must be one of: ${values.join(", ")}`;
      }
      return null;
    });
    return this;
  }
}

// Boolean Validator
class BooleanValidator extends BaseValidator<boolean> {
  parse(value: any): boolean {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === 1) return true;
    if (value === "false" || value === 0) return false;
    throw new Error("Expected boolean");
  }
}

// Array Validator
class ArrayValidator<T> extends BaseValidator<T[]> {
  private itemValidator: BaseValidator<T> | null = null;

  parse(value: any): T[] {
    if (!Array.isArray(value)) {
      throw new Error("Expected array");
    }
    return value;
  }

  of<U>(validator: BaseValidator<U>): ArrayValidator<U> {
    const newValidator = new ArrayValidator<U>();
    newValidator.itemValidator = validator;
    newValidator.rules = [...this.rules];
    return newValidator;
  }

  min(length: number): this {
    this.rules.push((value, path) => {
      if (value.length < length) {
        return `Array must have at least ${length} items`;
      }
      return null;
    });
    return this;
  }

  max(length: number): this {
    this.rules.push((value, path) => {
      if (value.length > length) {
        return `Array must have at most ${length} items`;
      }
      return null;
    });
    return this;
  }

  validate(value: any, path: string = "root"): ValidationResult<T[]> {
    const baseResult = super.validate(value, path);
    if (!baseResult.isValid()) {
      return baseResult as ValidationResult<T[]>;
    }

    const parsed = baseResult.getData()!;

    if (this.itemValidator) {
      const errors: ValidationErrorDetail[] = [];
      const validatedItems: T[] = [];

      for (let i = 0; i < parsed.length; i++) {
        const itemResult = this.itemValidator.validate(
          parsed[i],
          `${path}[${i}]`,
        );
        if (!itemResult.isValid()) {
          errors.push(...itemResult.getErrors());
        } else {
          validatedItems.push(itemResult.getData()!);
        }
      }

      if (errors.length > 0) {
        return new ValidationResult<T[]>(null, new ValidationError(errors));
      }
      return new ValidationResult<T[]>(validatedItems, new ValidationError([]));
    }

    return new ValidationResult<T[]>(parsed, new ValidationError([]));
  }
}

// Object Validator
export class ObjectValidator<
  T extends Record<string, any>,
> extends BaseValidator<T> {
  private shape: Record<string, BaseValidator<any>> = {};

  parse(value: any): T {
    if (typeof value !== "object" || value === null) {
      throw new Error("Expected object");
    }
    return value as T;
  }

  define<S extends Record<string, BaseValidator<any>>>(
    schema: S,
  ): ObjectValidator<{
    [K in keyof S]: S[K] extends BaseValidator<infer U> ? U : never;
  }> {
    const validator = new ObjectValidator<{
      [K in keyof S]: S[K] extends BaseValidator<infer U> ? U : never;
    }>();
    validator.shape = schema;
    return validator;
  }

  validate(value: any, path: string = "root"): ValidationResult<T> {
    const baseResult = super.validate(value, path);
    if (!baseResult.isValid()) {
      return baseResult;
    }

    const parsed = baseResult.getData()!;
    const errors: ValidationErrorDetail[] = [];
    const result: any = {};

    for (const [key, validator] of Object.entries(this.shape)) {
      const fieldResult = validator.validate(parsed[key], `${path}.${key}`);
      if (!fieldResult.isValid()) {
        errors.push(...fieldResult.getErrors());
      } else {
        result[key] = fieldResult.getData();
      }
    }

    if (errors.length > 0) {
      return new ValidationResult<T>(null, new ValidationError(errors));
    }

    return new ValidationResult<T>(result, new ValidationError([]));
  }
}

// Validation Schema Builder
export class Schema {
  static string(): StringValidator {
    return new StringValidator();
  }

  static number(): NumberValidator {
    return new NumberValidator();
  }

  static boolean(): BooleanValidator {
    return new BooleanValidator();
  }

  static array<T = any>(): ArrayValidator<T> {
    return new ArrayValidator<T>();
  }

  static object<T extends Record<string, any> = any>(): ObjectValidator<T> {
    return new ObjectValidator<T>();
  }
}

export { ValidationResult, ValidationError, type ValidationErrorDetail };
