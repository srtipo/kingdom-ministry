import { z } from "@/src/presentation/libraries/zod";
import { useCallback, useState } from "react";

/**
 * Hook que recibe un `ZodSchema` y devuelve una función de validación.
 * La función devuelve `{ success: true, data }` o `{ success: false, errors, zodError }`.
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      errors: Record<string, string[]>;
      zodError: z.ZodError<T>;
    };

type ValidateFieldResult = { valid: true } | { valid: false; errors: string[] };
export default function useZodValidator<T>(schema: z.ZodType<T, any, any>) {
  const [errorsState, setErrorsState] = useState<Record<
    string,
    string[]
  > | null>(null);

  const buildNestedObjectFromPath = (path: string, value: unknown) => {
    const parts = path === "_root" ? [] : path.split(".");
    if (parts.length === 0) return value as any;

    return parts.reduceRight((acc, key) => ({ [key]: acc }), value);
  };

  const validate = useCallback(
    (value: unknown): ValidationResult<T> => {
      const parsed = schema.safeParse(value);
      if (parsed.success) {
        setErrorsState(null);
        return { success: true, data: parsed.data };
      }

      const errors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue: z.ZodError<T>["issues"][number]) => {
        const key =
          issue.path && issue.path.length
            ? issue.path.map(String).join(".")
            : "_root";
        if (!errors[key]) errors[key] = [];
        errors[key].push(issue.message);
      });

      setErrorsState(errors);
      return { success: false, errors, zodError: parsed.error };
    },
    [schema],
  );

  const clearErrors = useCallback(() => setErrorsState(null), []);

  const validateField = useCallback(
    (path: string, value: unknown): ValidateFieldResult => {
      // Build object with only that field present and validate against partial schema when available
      const obj = buildNestedObjectFromPath(path, value);
      const anySchema = schema as any;
      let parsed: { success: boolean; error?: any; data?: any };

      if (anySchema && typeof anySchema.partial === "function") {
        const partial = anySchema.partial();
        parsed = partial.safeParse(obj);
      } else {
        // fallback: if schema isn't an object schema with partial, try validating the raw value
        parsed = anySchema.safeParse
          ? anySchema.safeParse(value)
          : { success: true, data: value };
      }

      if (parsed.success) {
        // remove any errors for this path
        const key = path || "_root";
        const current = errorsState ? { ...errorsState } : {};
        if (current && key in current) delete current[key];
        setErrorsState(Object.keys(current).length ? current : null);
        return { valid: true };
      }

      const fieldErrors: string[] = [];
      parsed.error.issues.forEach(
        (issue: z.ZodError<any>["issues"][number]) => {
          const issuePath =
            issue.path && issue.path.length
              ? issue.path.map(String).join(".")
              : "_root";
          if (
            issuePath === path ||
            issuePath.startsWith(path + ".") ||
            (path === "_root" && issuePath === "_root")
          ) {
            fieldErrors.push(issue.message);
          }
        },
      );

      // update errorsState for this key
      const key = path || "_root";
      const next = errorsState ? { ...errorsState } : {};
      if (fieldErrors.length) next[key] = fieldErrors;
      else if (key in next) delete next[key];
      setErrorsState(Object.keys(next).length ? next : null);

      return fieldErrors.length
        ? { valid: false, errors: fieldErrors }
        : { valid: true };
    },
    [schema, errorsState],
  );
  return { validate, validateField, errors: errorsState, clearErrors } as const;
}
