import * as React from "react"
import Svg, { G, Circle, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SELECTED_CARTICON = (props) => (
  <Svg
    width={43}
    height={43}
    fill="none"
    {...props}
  >
    <G filter="url(#a)">
      <Circle cx={21.5} cy={17.5} r={17.5} fill="#FAE1BD" />
      <G
        stroke="#FFBE98"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3.344}
        filter="url(#b)"
      >
        <Path d="M29.25 28a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3ZM18.25 28a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3ZM13.3 8.2H32l-2.2 12.1H15.5L13.3 8.2Zm0 0C13.117 7.467 12.2 6 10 6M29.8 20.3H13.554c-1.963 0-3.004.86-3.004 2.2 0 1.34 1.041 2.2 3.004 2.2H29.25" />
      </G>
    </G>
    <Defs></Defs>
  </Svg>
)
export default SELECTED_CARTICON
