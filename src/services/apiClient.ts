/**
 * API Client Service - طبقة API الموحدة
 * wrapper للـ fetch مع معالجة الأخطاء
 */

import { ApiError } from '@/lib/errors';

export interface RequestConfig {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
}

export interface ApiClientOptions {
    baseURL: string;
    defaultHeaders?: Record<string, string>;
    timeout?: number;
    onAuthError?: () => void;
}

/**
 * API Client الافتراضي
 */
class ApiClient {
    private baseURL: string;
    private defaultHeaders: Record<string, string>;
    private timeout: number;
    private onAuthError: (() => void) | undefined;

    constructor(options: ApiClientOptions) {
        this.baseURL = options.baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...options.defaultHeaders,
        };
        const timeoutValue = options.timeout;
        this.timeout = timeoutValue !== undefined ? timeoutValue : 30000;
        this.onAuthError = options.onAuthError;
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'POST', body });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'PUT', body });
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }

    /**
     * تنفيذ الطلب
     */
    private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const { method = 'GET', headers = {}, body } = config;

        // التحقق من timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const requestOptions: RequestInit = {
                method,
                headers: {
                    ...this.defaultHeaders,
                    ...headers,
                },
                signal: controller.signal,
            };

            // إضافة body فقط إذا كان موجوداً
            if (body !== undefined) {
                requestOptions.body = JSON.stringify(body);
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);

            clearTimeout(timeoutId);

            // معالجة أخطاء HTTP
            if (!response.ok) {
                // معالجة خطأ المصادقة
                if (response.status === 401 && this.onAuthError !== undefined) {
                    this.onAuthError();
                }

                const error = await response.json().catch(() => ({}));
                throw new ApiError(
                    error.message || `HTTP Error: ${response.status}`,
                    response.status,
                    error.details
                );
            }

            // إذا كان response فارغ
            if (response.status === 204) {
                return undefined as T;
            }

            return response.json();
        } catch (error) {
            clearTimeout(timeoutId);

            // إعادة رمي الأخطاء المعروفة
            if (error instanceof ApiError) {
                throw error;
            }

            // أخطاء الشبكة
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new ApiError('خطأ في الاتصال بالخادم', 0);
            }

            // أخطاء Abort (timeout)
            if (error instanceof DOMException && error.name === 'AbortError') {
                throw new ApiError('انتهت مهلة الطلب', 408);
            }

            throw error;
        }
    }
}

// التصدير الافتراضي
export const apiClient = new ApiClient({
    baseURL: '/api',
    timeout: 30000,
    onAuthError: () => {
        // معالجة خطأ المصادقة
        console.warn('Unauthorized - redirect to login');
    },
});

export default apiClient;
