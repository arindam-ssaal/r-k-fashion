function Footer() {
    return (
        <footer className="mt-6 text-center">
            <p className="text-[11px] font-medium" style={{ color: '#B8D9F0', opacity: 0.4, fontFamily: "'JetBrains Mono', monospace" }}>
                Sapphire POS v3.0.0 · © {new Date().getFullYear()} · SAP B1 Integrated
            </p>
        </footer>
    );
}
export default Footer