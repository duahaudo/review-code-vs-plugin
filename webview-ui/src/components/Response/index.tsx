import React from 'react';
import './style.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function Response({ response }: any) {
  // parse response as JavaScript object
  const parsedResponse = JSON.parse(JSON.stringify(response));

  // split response into sections
  const sections = parsedResponse.split(/(```[\S\s]+?```|`[\S\s]+?`(?:\n|[^\n]*?\n)|[^\n]*?\n)/g);

  // map through sections and add styles depending on section type
  const formattedSections = sections.map((section: any, i: number) => {
    if (section.startsWith('```')) {
      const code = section.slice(3, -3);
      return (
        <SyntaxHighlighter
          key={i}
          language="javascript"
          style={atomOneDark}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      );
    } else if (section.startsWith('`')) {
      const highlightedText = section.slice(1, -1);
      return (
        <span className="response-highlight" key={i}>
          {highlightedText}
        </span>
      );
    } else {
      return (
        <p className="response-text" key={i}>
          {
            section.split(/(`[^`]+`)/g).map((part: string, j: number) => {
              if (part.startsWith('`')) {
                return React.createElement('span', { className: 'response-highlight', key: `${i}-${j}` }, part.replace(/`/g, ''));
              }
              return part;
            })
          }
        </p>
      );
    }
  });
  console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ formattedSections ➡ formattedSections:`, formattedSections);

  return (
    <div className="response-container">
      {formattedSections}
    </div>
  );
}

export default Response;