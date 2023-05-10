import "./App.css";
import { Title } from "./App.styled";
import CodePanel from "./components/CodePanel";
import Optimize from "./components/Optimize";

const App = () => {


  return (
    <main>
      <CodePanel />
      <Title>Optimize</Title>
      <Optimize />
    </main>
  );
}

export default App;
