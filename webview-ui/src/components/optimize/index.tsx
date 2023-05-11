import { useContext } from "react"
import { WebViewContext } from "../../reducer"
import Response from "../Response"

const Optimize = () => {
  const { state } = useContext(WebViewContext)

  return (
    <div className="container">
      <h3>Result</h3>
      <Response response={state.optimize} />
    </div>
  )
}

export default Optimize