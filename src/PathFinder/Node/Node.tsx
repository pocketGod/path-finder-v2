import { FunctionComponent } from "react";

import '../Node/Node.css'

interface NodeProps {
    isStart:boolean
    isFinish:boolean
    col:any
    isWall:boolean
    onMouseDown:any
    onMouseEnter:any
    onMouseUp:any
    row:any
}
 
const Node: FunctionComponent<NodeProps> = ({isStart, isFinish, isWall, row, col, onMouseDown, onMouseEnter, onMouseUp}) => {

    const extraClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall
    ? 'node-wall'
    : '';

    return ( <>

        <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}>
            <span className="icon-container">
                {isStart? (<i className="fa-solid fa-play fs-6"></i>):(isFinish? (<i className="fa-solid fa-flag-checkered"></i>):(<></>))}
            </span>
            <span className="spacer">.</span>
        </div>
    
    </> );
}
 
export default Node;