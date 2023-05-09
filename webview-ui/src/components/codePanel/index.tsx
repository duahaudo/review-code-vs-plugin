import { Block } from "./styled"

const CodePanel = ({ code }: { code: string }) => {
  return (
    <Block>
      <code>
        {code}
      </code>
    </Block>
  )
}

export default CodePanel