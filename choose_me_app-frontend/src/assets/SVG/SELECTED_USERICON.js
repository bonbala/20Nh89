import * as React from "react"
import Svg, { G, Circle, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SELECTED_USERICON = (props) => (
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
          fillRule="evenodd"
          d="M15.5 8a6 6 0 1 0 12 0 6 6 0 0 0-12 0Zm5.975 9c-7.082 0-12.893 3.64-13.474 10.799-.032.39.714 1.201 1.09 1.201h24.78c1.126 0 1.143-.907 1.126-1.2-.44-7.36-6.34-10.8-13.522-10.8Z"
          clipRule="evenodd"
        />
      </G>
    </G>
    <Defs></Defs>
  </Svg>
)
export default SELECTED_USERICON