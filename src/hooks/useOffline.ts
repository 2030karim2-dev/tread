import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect online/offline status
 * Returns isOnline boolean and helper functions
 */
export function useOffline() {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        // Use ref to track if we were offline without causing re-renders
        const wasOfflineRef = { current: false };

        const handleOnline = () => {
            setIsOnline(true);
            if (wasOfflineRef.current) {
                // Trigger sync when coming back online
                window.dispatchEvent(new CustomEvent('app:online'));
            }
            wasOfflineRef.current = false;
        };

        const handleOffline = () => {
            setIsOnline(false);
            wasOfflineRef.current = true;
            window.dispatchEvent(new CustomEvent('app:offline'));
        };

        // Add event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial state
        setIsOnline(navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []); // Empty dependency array - effect runs once on mount

    // Check if should show sync warning
    const shouldShowSyncWarning = useCallback(() => {
        return !isOnline;
    }, [isOnline]);

    return {
        isOnline,
        isOffline: !isOnline,
        shouldShowSyncWarning,
    };
}

/**
 * Hook to automatically sync data when coming back online
 */
export function useOnlineSync(onSync: () => Promise<void>) {
    const { isOnline } = useOffline();
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const handleOnline = async () => {
            if (!isSyncing) {
                setIsSyncing(true);
                try {
                    await onSync();
                } catch (error) {
                    console.error('Sync failed:', error);
                } finally {
                    setIsSyncing(false);
                }
            }
        };

        window.addEventListener('app:online', handleOnline);

        return () => {
            window.removeEventListener('app:online', handleOnline);
        };
    }, [isOnline, isSyncing, onSync]);

    return { isSyncing };
}

/**
 * Hook to check network quality
 */
export function useNetworkStatus() {
    const [connection, setConnection] = useState<{
        effectiveType: string;
        downlink: number;
        rtt: number;
    } | null>(null);

    useEffect(() => {
        // Use Navigator.connection if available (Network Information API)
        // Define a proper interface for the connection object
        interface NetworkConnection {
            effectiveType?: string;
            downlink?: number;
            rtt?: number;
            addEventListener?: (type: string, listener: EventListener) => void;
            removeEventListener?: (type: string, listener: EventListener) => void;
        }

        const nav = navigator as Navigator & { connection?: NetworkConnection };
        const connection = nav.connection;

        if (connection) {
            const updateConnection = () => {
                setConnection({
                    effectiveType: connection.effectiveType || 'unknown',
                    downlink: connection.downlink || 0,
                    rtt: connection.rtt || 0,
                });
            };

            updateConnection();
            if (connection.addEventListener) {
                connection.addEventListener('change', updateConnection);
            }

            return () => {
                if (connection.removeEventListener) {
                    connection.removeEventListener('change', updateConnection);
                }
            };
        }
    }, []);

    const isSlow = connection?.effectiveType === 'slow-2g' ||
        connection?.effectiveType === '2g';

    return {
        connection,
        isSlow,
        is4g: connection?.effectiveType === '4g',
    };
}
