import { useContext } from "react"
import { Block } from "./styled"
import { WebViewContext } from "../../reducer"

const CodePanel = () => {
  const { state } = useContext(WebViewContext)

  return (
    <Block>
      {state.code}
    </Block>
  )
}

export default CodePanel