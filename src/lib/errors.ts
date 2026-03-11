/**
 * Error Handling Utilities - أدوات معالجة الأخطاء
 * نظام موحد للتعامل مع الأخطاء في التطبيق
 */

/**
 * Error class الأساسية للتطبيق
 */
export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * أخطاء API
 */
export class ApiError extends AppError {
    constructor(
        message: string,
        statusCode: number = 500,
        details?: Record<string, unknown>
    ) {
        super(message, 'API_ERROR', statusCode, details);
        this.name = 'ApiError';
    }
}

/**
 * أخطاء التحقق من البيانات
 */
export class ValidationError extends AppError {
    public errors: ValidationErrorItem[];

    constructor(
        message: string,
        errors: ValidationErrorItem[] = []
    ) {
        super(message, 'VALIDATION_ERROR', 400, { errors });
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

/**
 * عنصر خطأ التحقق
 */
interface ValidationErrorItem {
    field: string;
    message: string;
    code?: string;
}

/**
 * أخطاء المصادقة
 */
export class AuthError extends AppError {
    constructor(message: string = 'غير مصرح') {
        super(message, 'AUTH_ERROR', 401);
        this.name = 'AuthError';
    }
}

/**
 * أخطاء عدم_found
 */
export class NotFoundError extends AppError {
    constructor(resource: string = 'المورد') {
        super(`${resource} غير موجود`, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}

/**
 * أخطاء Rate Limiting
 */
export class RateLimitError extends AppError {
    constructor(message: string = 'تجاوزت الحد المسموح') {
        super(message, 'RATE_LIMIT', 429);
        this.name = 'RateLimitError';
    }
}

/**
 * error handler للـ fetch
 */
export async function handleApiError<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new ApiError(
            errorData.message || `HTTP Error: ${response.status}`,
            response.status,
            errorData.details
        );
    }

    return response.json();
}

/**
 * error handler عام للـ async functions
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    errorHandler?: (error: Error) => void
): T {
    return ((...args: unknown[]) => {
        try {
            return fn(...args);
        } catch (error) {
            if (errorHandler && error instanceof Error) {
                errorHandler(error);
            }
            throw error;
        }
    }) as T;
}

/**
 * معالجة الأخطاء مع fallback
 */
export async function tryCatch<T>(
    promise: Promise<T>,
    fallback: T
): Promise<[T | null, Error | null]> {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        return [fallback, error as Error];
    }
}

/**
 * retry decorator
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }

    throw lastError!;
}

/**
 * error logger
 */
export function logError(error: Error, context?: Record<string, unknown>): void {
    console.error('Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
    });
}
