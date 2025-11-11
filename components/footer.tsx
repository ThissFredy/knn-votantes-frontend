export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-[#00462a] text-white py-6 mt-auto">
            <div className="container mx-auto px-6 text-center">
                <p>
                    &copy; {currentYear} Universidad de Cundinamarca. Todos los
                    derechos reservados.
                </p>
                <p className="text-sm mt-1">
                    Desarrollado como proyecto académico de Machine Learning.
                </p>
            </div>
        </footer>
    );
}
