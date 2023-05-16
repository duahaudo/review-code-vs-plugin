import { useEffect, useState } from "react";
import "./style.css";

const Thinking = () => {
  const [think, setThink] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setThink((prevThink) => {
        if (prevThink.length < 5) {
          return prevThink + "💭";
        } else {
          return "";
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <div className="think">{think}</div>;
};

export default Thinking;
