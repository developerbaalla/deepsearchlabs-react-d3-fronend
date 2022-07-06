import React, { useEffect, useState, useRef } from 'react';
import Tree from 'react-d3-tree';

const baseURL = "http://127.0.0.1:8000";

const containerStyles = {
  width: "100%",
  height: "100vh"
};

const svgSquare = {
  shape: "rect",
  shapeProps: {
    width: 20,
    height: 20,
    x: -10,
    y: -10
  }
};

const Graph2 = () => {

  const [data, setData] = useState({});
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const treeContainer = useRef(null);

	useEffect(()=>{
		fetch(`${baseURL}/sentence_keywords`)
			.then(response => response.json())
			.then(_data=>{

        const dimensions = treeContainer.current.getBoundingClientRect();
        setTranslate({
            x: dimensions.width / 3,
            y: dimensions.width / 3
        });

        const new_data = _data.map(info => {
          return {
            name: info.sentence.substring(0,10) +'...',
            children: info.sentence_keywords.map(key => { return {name: key.value} })
          }
        });

        setData({name: "Keywords", children: new_data});
        
			})
	},[])

	return (
    <div style={containerStyles} ref={treeContainer}>
      <Tree
        data={data}
        translate={translate}
        orientation={"horizontal"}
        nodeSvgShape={svgSquare}
        circleRadius={5}
        separation={{ siblings: 0.3, nonSiblings: 1 }}
      />
    </div>
	)
}

export default Graph2;