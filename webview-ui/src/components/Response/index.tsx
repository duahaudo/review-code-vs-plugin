import React from "react";
import "./style.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

function Response({ response }: any) {
  // parse response as JavaScript object
  const parsedResponse = JSON.parse(JSON.stringify(response));

  // split response into sections
  const sections = parsedResponse.split(/(```[\S\s]+?```|`[\S\s]+?`(?:\n|[^\n]*?\n)|[^\n]*?\n)/g);

  // map through sections and add styles depending on section type
  const formattedSections = sections.map((section: any, i: number) => {
    if (section.startsWith("```")) {
      const code = section.slice(3, -3);
      return (
        <SyntaxHighlighter key={i} language="javascript" style={atomOneDark} showLineNumbers>
          {code}
        </SyntaxHighlighter>
      );
    } else if (section.startsWith("`")) {
      const highlightedText = section.slice(1, -1);
      return (
        <span className="response-highlight" key={i}>
          {highlightedText}
        </span>
      );
    } else {
      return (
        <p className="response-text" key={i}>
          {section.split(/(`[^`]+`)/g).map((part: string, j: number) => {
            if (part.startsWith("`")) {
              return React.createElement(
                "span",
                { className: "response-highlight", key: `${i}-${j}` },
                part.replace(/`/g, "")
              );
            }
            return part;
          })}
        </p>
      );
    }
  });

  return <div className="response-container">{formattedSections}</div>;
}

export default Response;

export const SlackMarkup: React.FC<any> = ({ text }) => {
  const renderText = () => {
    const blocks = text.split("```");
    return blocks.map((block: any, index: any) => {
      if (index % 2 === 1) {
        // Code block
        const language = block.split("\n")[0];
        const code = block.replace(language, "").trim();
        return (
          <SyntaxHighlighter language="typescript" style={atomOneDark} key={index}>
            {code}
          </SyntaxHighlighter>
        );
      } else {
        // Normal text
        const lines = block.split("\n");
        return (
          <span key={index} className="response-text">
            {lines.map((line: any, lineIndex: any) => {
              if (line.includes("`")) {
                const parts = line.split("`");
                return (
                  <React.Fragment key={lineIndex}>
                    {parts.map((part: any, partIndex: any) => (
                      <React.Fragment key={partIndex}>
                        {partIndex % 2 === 1 ? (
                          <span className="response-highlight">{part}</span>
                        ) : (
                          <>{part}</>
                        )}
                      </React.Fragment>
                    ))}
                    <br /> {/* Add a new line */}
                  </React.Fragment>
                );
              } else {
                return (
                  <React.Fragment key={lineIndex}>
                    {line}
                    <br /> {/* Add a new line */}
                  </React.Fragment>
                );
              }
            })}
          </span>
        );
      }
    });
  };

  return <>{renderText()}</>;
};
