import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
const USERICON = (props) => (
  <Svg
    width={35}
    height={35}
    fill="none"
    {...props}
  >
    <Circle cx={17.5} cy={17.5} r={17.5} fill="#fff" />
    <Path
      fill="#868686"
      fillRule="evenodd"
      d="M11.27 8.104c0 3.372 2.686 6.105 6 6.105 3.313 0 6-2.733 6-6.105 0-3.371-2.687-6.104-6-6.104-3.314 0-6 2.733-6 6.104Zm6.205 8.688c-7.082 0-12.893 3.703-13.474 10.987-.032.396.714 1.222 1.09 1.222h24.78c1.126 0 1.143-.923 1.126-1.221-.44-7.488-6.34-10.988-13.522-10.988Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default USERICON
