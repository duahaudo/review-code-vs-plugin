import { useContext, useMemo } from "react"
import { WebViewContext } from "../../reducer"
import CodeBlock from "../CodeBlock"

const splitTextField = (str: string) => {
  let result = [];

  const regex = /```([a-z]*\n)?([\s\S]*?)```/gi;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(str)) !== null) {
    const language = match[1] ? match[1].trim() : '';
    const code = match[2];
    const text = str.substring(lastIndex, match.index);
    lastIndex = match.index + match[0].length;

    result.push({ type: 'text', content: text })
    result.push({ type: 'code', content: code, language })
  }

  console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ displayText ➡ result:`, result);
  return result
}

const Optimize = () => {
  const { state } = useContext(WebViewContext)

  const displayText = useMemo(() => {
    const result = state.optimize.split('\n\n').reduce(
      (_result: any, textBlock: string) => ([..._result, ...splitTextField(textBlock)]), [])
    return result
  }, [state.optimize])

  return (
    <div className="container">
      <h3>Result</h3>
      {state.optimize && <div className="result-display">
        {displayText.map((item, idx) => {
          if (item.type === "text") {
            return <div key={idx}>{item.content}</div>
          }

          return <CodeBlock key={idx} code={item.content} language={item.language} />
        })}

      </div>}
    </div>
  )
}

export default Optimize