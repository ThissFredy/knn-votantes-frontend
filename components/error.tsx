export default function Error() {
    return (
        <main className="bg-white text-white flex items-center justify-center p-4 min-h-screen">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-xl p-10 text-center border-2 border-red-100">
                <svg
                    className="w-20 h-20 text-red-500 mx-auto mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L12.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Servicio No Disponible
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                    En este momento, no podemos conectarnos con el servidor de
                    predicciones.
                </p>
                <p className="text-gray-500">
                    Por favor, inténtalo de nuevo más tarde.
                </p>
            </div>
        </main>
    );
}
