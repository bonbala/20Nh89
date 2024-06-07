import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
const CARTICON = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={35}
    fill="none"
    {...props}
  >
    <Circle cx={17.5} cy={17.5} r={17.5} fill="#fff" />
    <Path
      fill="#868686"
      stroke="#868686"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.344}
      d="M25.25 28a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3ZM14.25 28a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3Z"
    />
    <Path
      stroke="#868686"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.344}
      d="M9.3 8.2H28l-2.2 12.1H11.5L9.3 8.2Zm0 0C9.117 7.467 8.2 6 6 6M25.8 20.3H9.554c-1.963 0-3.004.86-3.004 2.2 0 1.34 1.041 2.2 3.004 2.2H25.25"
    />
  </Svg>
)
export default CARTICON
