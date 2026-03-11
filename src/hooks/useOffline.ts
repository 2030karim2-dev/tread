// Offline Detection Hook - China Trade Assistant Pro

import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useAppStore } from '../stores/appStore';

export function useOffline() {
    const [isOffline, setIsOffline] = useState(false);
    const setStoreOffline = useAppStore((state) => state.setOffline);

    useEffect(() => {
        // Check initial state
        const checkConnection = async () => {
            const state = await NetInfo.fetch();
            setIsOffline(!state.isConnected);
            setStoreOffline(!state.isConnected);
        };

        checkConnection();

        // Subscribe to changes
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            const offline = !state.isConnected;
            setIsOffline(offline);
            setStoreOffline(offline);
        });

        return () => {
            unsubscribe();
        };
    }, [setStoreOffline]);

    return isOffline;
}

export function useNetworkStatus() {
    const [networkType, setNetworkType] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    useEffect(() => {
        const checkConnection = async () => {
            const state = await NetInfo.fetch();
            setNetworkType(state.type);
            setIsConnected(state.isConnected);
        };

        checkConnection();

        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setNetworkType(state.type);
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return { networkType, isConnected };
}
