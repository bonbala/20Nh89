import * as React from "react"
import Svg, { G, Circle, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SELECTED_BOOKMARKICON = (props) => (
  <Svg
    width={43}
    height={43}
    fill="none"
    {...props}
  >
    <G filter="url(#a)">
      <Circle cx={21.5} cy={17.5} r={17.5} fill="#FAE1BD" />
      <G filter="url(#b)">
        <Path
          fill="#FFBE98"
          d="M12 29.429V7.714c0-.746.266-1.385.797-1.917A2.614 2.614 0 0 1 14.714 5h13.572c.746 0 1.385.266 1.917.797.531.532.797 1.17.797 1.917V29.43l-9.5-4.072L12 29.43Zm2.714-4.14 6.786-2.918 6.786 2.918V7.714H14.714V25.29Z"
        />
      </G>
    </G>
    <Defs></Defs>
  </Svg>
)
export default SELECTED_BOOKMARKICON