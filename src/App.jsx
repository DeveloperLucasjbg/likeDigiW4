import Run from "./routes/Run";

function App() {
  if (window.location.pathname === "/run") {
    return <Run />;
  }

  return (
    <main className="app-fallback">
      <p>Abrir la escena inicial en /run.</p>
    </main>
  );
}

export default App;
