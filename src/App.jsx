import Run from "./routes/Run";

function App() {
  return window.location.pathname === "/run" ? <Run /> : null;
}

export default App;
