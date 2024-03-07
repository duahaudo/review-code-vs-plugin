import { useContext, useEffect, useState } from "react";
import { WebViewContext } from "../../reducer";
import MarkdownRenderer from "../CodeBlock";

const Optimize = () => {
  const context = useContext(WebViewContext);
  const { state } = context;
  const [data, setData] = useState<string>(state.optimize);

  useEffect(() => {
    setData(state.optimize);
  }, [state.optimize]);

  return (
    <div className="container">
      <MarkdownRenderer code={data || ""} />
    </div>
  );
};

export default Optimize;
