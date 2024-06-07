import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
const BOOKMARKICON = (props) => (
  <Svg
    width={35}
    height={35}
    fill="none"
    {...props}
  >
    <Circle cx={17.5} cy={17.5} r={17.5} fill="#fff" />
    <Path
      fill="#868686"
      d="M8 29.429V7.714c0-.746.266-1.385.797-1.917A2.614 2.614 0 0 1 10.714 5h13.572c.746 0 1.385.266 1.917.797.531.532.797 1.17.797 1.917V29.43l-9.5-4.072L8 29.43Zm2.714-4.14 6.786-2.918 6.786 2.918V7.714H10.714V25.29Z"
    />
  </Svg>
)
export default BOOKMARKICON
