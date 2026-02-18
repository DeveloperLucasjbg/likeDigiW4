import { useEffect, useState } from "react";
import Run from "./routes/Run";

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (pathname === "/run") {
    return <Run />;
  }

  return (
    <main className="app-fallback">
      <h1>Digi World 4 Like</h1>
      <p>
        Escena inicial lista en <a href="/run">/run</a>.
      </p>
    </main>
  );
}

export default App;
