import { FunctionComponent, useEffect, useState } from "react";
import Node from './Node/Node'
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/Dijkstra";

import './PathFinder.css'

interface PathFinderProps {
    
}
 
const PathFinder: FunctionComponent<PathFinderProps> = () => {

    const rowAmount:number = 20
    const colAmount:number = 40

    const [grid, setGrid] = useState<any>([])
    const [mouseIsPressed, setMouseIsPressed] = useState<boolean>(false)
    const [selections, setSelections] = useState<any>({start:{row:1,col:2}, finish:{row:10,col:18}})

    const [pathStepCount, setPathStepCount] = useState<number>(0)

    const [pathResolved, setPathResolved] = useState<boolean>(false)

    const [currentlyWorking, setCurrentlyWorking] = useState<boolean>(false)

    useEffect(() => {
        const newGrid = getInitialGrid();
        setGrid(newGrid)
        setPathStepCount(0)
    }, [selections]);

    const getInitialGrid = () => {
        const newGrid = [];
        for (let row = 0; row < rowAmount; row++) {
          const currentRow = [];
          for (let col = 0; col < colAmount; col++) {
            currentRow.push(createNode(col, row));
          }
          newGrid.push(currentRow);
        }
        return newGrid;
    }

    const createNode = (col:number, row:number) => {
        return {
          col,
          row,
          isStart: row === selections.start.row && col === selections.start.col,
          isFinish: row === selections.finish.row && col === selections.finish.col,
          distance: Infinity,
          isVisited: false,
          isWall: false,
          previousNode: null,
        }
    }

    const getNewGridWithWallToggled = (oldGrid:any, row:number, col:number, type:string) => {
        const newGrid = oldGrid.slice();


        const node = newGrid[row][col];

        if(node.isFinish || node.isStart || currentlyWorking) return oldGrid
        
        const newNode = {
          ...node,
          isWall: !node.isWall,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    }

    const handleMouseDown = (row:number, col:number) =>{
        const newGrid = getNewGridWithWallToggled(grid, row, col, 'regular');
        setMouseIsPressed(true)
        setGrid(newGrid)
    }

    const handleMouseEnter = (row:number, col:number)=>{
        if (!mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col, 'regular');
        setGrid(newGrid)
    }

    const  handleMouseUp = ()=>{
        setMouseIsPressed(false)
    }

    const animateDijkstra = (visitedNodesInOrder:any, nodesInShortestPathOrder:any) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            (document.getElementById(`node-${node.row}-${node.col}`) as unknown as HTMLElement).className =
              'node node-visited';
          }, 10 * i);
        }
    }

    const animateShortestPath = (nodesInShortestPathOrder:any)=> {
        if(nodesInShortestPathOrder[0].isFinish) {
            setTimeout(()=>{
                setCurrentlyWorking(false)
                setPathResolved(false)
            },200)
            alert('No Solution')
            return
        }
        
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            (document.getElementById(`node-${node.row}-${node.col}`) as unknown as HTMLElement).className =
              'node node-shortest-path';
          }, 50 * i);

          setPathStepCount(nodesInShortestPathOrder.length)

          if(i==nodesInShortestPathOrder.length-1){
            setTimeout(()=>{
                setCurrentlyWorking(false)
                
                setPathResolved(true)
            },200)
          }
        }
      }

    const visualizeDijkstra = ()=>{
        setCurrentlyWorking(true)
        // setPathResolved(true)
        let startNode = grid[selections.start.row][selections.start.col];
        let finishNode = grid[selections.finish.row][selections.finish.col];
        let visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        let nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
    
    const handleReset = ()=>{
      setPathResolved(false)
        document.querySelectorAll('.node-visited').forEach((elem)=>{
            elem.classList.toggle('node-visited')
        })
        document.querySelectorAll('.node-shortest-path').forEach((elem)=>{
            elem.classList.toggle('node-shortest-path')
        })
        setSelections(getCellPosition('start/end', {}))
    }

    const getCellPosition = (type:string, val:any):any =>{
      if(type=='start/end'){
        let startRow = Math.floor(Math.random()*rowAmount)
        let startCol = Math.floor(Math.random()*colAmount)
        let finishRow = Math.floor(Math.random()*rowAmount)
        let finishCol = Math.floor(Math.random()*colAmount)
        if(startRow==finishRow && startCol==finishCol) return getCellPosition('start/end', {})
        return {start:{row:startRow,col:startCol}, finish:{row:finishRow,col:finishCol}}
      }
        
    }

    const handleGenerateRandomWalls = ()=>{
      for (let i = 0; i < colAmount*1.5; i++) {
        let rowW = Math.floor(Math.random()*(rowAmount-1))
        let colW = Math.floor(Math.random()*(colAmount-1))
        const newGrid = getNewGridWithWallToggled(grid, rowW, colW, 'regular')
        setGrid(newGrid)
      }
      
    }
    
    return (
        <>
          <button className="fs-3 btn btn-dark mx-1 mt-1" disabled={currentlyWorking || pathResolved} onClick={() => visualizeDijkstra()}>
            {pathResolved? (<>
              {pathStepCount-1}
              <br /> <span className="fs-6">Path Steps</span>
            </>):(<>
              <i className="fa-solid fa-magnifying-glass-arrow-right"></i>
              <br /> <span className="fs-6">Find Path</span>
            </>)}
          </button>
          <button className="fs-3 btn btn-dark mx-1 mt-1" onClick={handleReset} disabled={currentlyWorking}>
            <i className="fa-solid fa-skull"></i> 
            <br /> <span className="fs-6">Reset</span>
          </button>
          <button className="fs-3 btn btn-dark mx-1 mt-1" onClick={handleGenerateRandomWalls} disabled={currentlyWorking}>
            <i className="fa-solid fa-dice-three"></i>
            <br /> <span className="fs-6">Add Walls</span>
          </button>

          <div className="grid">
            
            {grid.map((row:any, rowIdx:number) => {
              return (
                <div className="node-container" key={rowIdx}>
                  {row.map((node:any, nodeIdx:number) => {
                    const {row, col, isFinish, isStart, isWall} = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        // mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row:any, col:any) => handleMouseDown(row, col)}
                        onMouseEnter={(row:any, col:any) =>
                          handleMouseEnter(row, col)
                        }
                        onMouseUp={() => handleMouseUp()}
                        row={row}></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      );
}
 
export default PathFinder;