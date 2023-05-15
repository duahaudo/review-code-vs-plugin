import { useContext, useEffect, useState } from "react";
import { WebViewContext } from "../../reducer";
import { SlackMarkup } from "../Response";

const Optimize = () => {
  const context = useContext(WebViewContext);
  const { state } = context;
  const [data, setData] = useState(state.optimize);

  useEffect(() => {
    setData(state.optimize);
  }, [state.optimize]);

  return (
    <div className="container">
      <SlackMarkup text={data} />
    </div>
  );
};

export default Optimize;
