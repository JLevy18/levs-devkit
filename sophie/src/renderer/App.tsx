import '../styles/App.css';

import Canvas from './components/Canvas';
import Toolbar from './components/toolbar/Toolbar';

export default function App() {
  return (
    <main>
      <Toolbar />
      <Canvas />
    </main>
  );
}
