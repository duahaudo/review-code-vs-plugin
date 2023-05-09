import { useContext } from "react"
import { Block } from "./styled"
import { WebViewContext } from "../../reducer"

const CodePanel = ({ code }: any) => {
  const { state } = useContext<any>(WebViewContext)

  console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ CodePanel ➡ code:`, state);

  return (
    <Block>
      {code}
    </Block>
  )
}

export default CodePanel