import { useContext } from "react"
import { WebViewContext } from "../../reducer"
import { Wrapper } from "./styled"

const Optimize = () => {
  const { state } = useContext(WebViewContext)

  return (
    <Wrapper>
      <pre>
        {state.optimize}
      </pre>
    </Wrapper>
  )
}

export default Optimize