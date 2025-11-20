"use client";

import React, { useEffect, useState } from "react";
import { getHealth } from "@/api/api";

function StatusDb() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            setIsLoading(true);
            const result = await getHealth();
            setIsConnected(result.status);
            setIsLoading(false);
        };

        checkStatus();
        const interval = setInterval(checkStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center gap-3 mb-4">
                <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="text-gray-600 font-medium">
                    Verificando estado...
                </div>
            </div>
        );
    }

    return (
        <div
            className={`border rounded-lg p-4 mb-4 flex items-center gap-3 ${
                isConnected
                    ? "bg-green-50 border-green-300"
                    : "bg-red-50 border-red-300"
            }`}>
            <div
                className={`w-4 h-4 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                }`}></div>
            <div>
                <div
                    className={`font-medium ${
                        isConnected ? "text-green-800" : "text-red-800"
                    }`}>
                    Base de Datos
                </div>
                <div
                    className={`text-sm ${
                        isConnected ? "text-green-700" : "text-red-700"
                    }`}>
                    {isConnected ? "Conectada" : "Desconectada"}
                </div>
            </div>
        </div>
    );
}
export default React.memo(StatusDb);
