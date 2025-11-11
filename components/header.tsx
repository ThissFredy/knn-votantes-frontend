import Image from "next/image";
export default function Header() {
    return (
        <header className="bg-[#00482b] text-white shadow-lg">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex gap-4 items-center hover:opacity-80 transition-opacity duration-300 hover:cursor-pointer">
                    <Image src="/logo.png" alt="Logo" width={50} height={50} />
                    <a href="/" className="text-xl font-bold">
                        Universidad de Cundinamarca
                    </a>
                </div>

                <div className="text-lg font-mono text-gray-200">
                    <div>Clasificador k-NN</div>
                    <div className="opacity-50">Fredy Zarate</div>
                    <div className="opacity-50">Juan Rodriguez</div>
                </div>
            </nav>
        </header>
    );
}
