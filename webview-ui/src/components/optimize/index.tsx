import { Wrapper } from "./styled"

const Optimize = ({ code }: any) => {
  return (
    <Wrapper>
      <pre>
        {code}
      </pre>
    </Wrapper>
  )
}

export default Optimize