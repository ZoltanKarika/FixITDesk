function AppLayout() {
  return (
    <>
      <Navbar /> {/* BUMM, itt a Navbarod! Ez csak a belső oldalakon fog létezni. */}
      <main>
        <Outlet /> {/* Itt jelenik meg a Dashboard, Profil, stb. */}
      </main>
    </>
  );
}