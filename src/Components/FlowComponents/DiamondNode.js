import React from 'react';
import { Handle } from 'react-flow-renderer';
import './index.css'

const DiamondNode = (({ data }) => {
    return (
        <div id="diamond">
            <Handle
                type="target"
                position="left"
                id="decision_a"
                style={{
                    background: "#295b88",
                    position: 'relative',
                    top: '60px',
                    zIndex: '2',
                    left: '-60px',
                    fontSize: '10px',
                    padding: '3px'
                }}
            />
            <p style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                color: 'black',
                zIndex: '2',
                fontSize: '16px',
                wordWrap: "normal",
                bottom: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>{data.name}</p>

            <div
                style={{
                    position: "absolute",
                    bottom: '-110px',
                    fontSize: "10px",
                    zIndex: '2',
                    right: 0,
                    color: 'black',
                    wordWrap: "normal",
                    left: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <p
                    style={{
                        border: "1px solid gray",
                    }}
                >
                    {
                        data.valueStreamName.substr(0, 10)
                    }
                </p>
            </div>
            <Handle
                type="source"
                position="right"
                id="decision_b"
                style={{
                    zIndex: '2',
                    top: '60px',
                    right: '-60px',
                    background: '#101921',
                    padding: '3px',
                    content: "data",
                }}
            />
        </div>
    );
});
export default DiamondNode;