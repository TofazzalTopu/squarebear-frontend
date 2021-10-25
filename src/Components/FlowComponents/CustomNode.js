import React from 'react';
import { Handle } from 'react-flow-renderer';

const CustomNode = (props) => {
  return (
    <div style={{
      background: 'white',
      color: 'black',
      border: '1px solid black',
      padding: '20px 40px',
      borderRadius: '7px',
      position: "relative"
    }}>
      <Handle
        type="target"
        position="left"
        style={{ background: '#555', padding: '3px' }}
        connectable="true"
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <div>
        {props.data.name}
        <p style={{
          position: "absolute",
          bottom: -10,
          fontSize: "10px",
          right: '0',
          border: "1px solid gray"
        }}>
          {
            props.data.valueStreamName
          }
        </p>
      </div>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{ top: 30, background: '#555', padding: '3px' }}
      />
    </div>
  );
};

export default CustomNode;