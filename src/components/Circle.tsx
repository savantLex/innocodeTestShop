import React from 'react';

type ColorCircleProps = {
    color: string
}

const ColorCircle: React.FC<ColorCircleProps> = ({color}) => {
    const circleStyle: React.CSSProperties = {
        backgroundColor: color,
        borderRadius: '50%',
        width: '25px',
        height: '25px',
        marginLeft: '5px',
        display: 'inline-block',
        border: '2px solid #000',
    };

    return <div style={circleStyle}/>;
};

export default ColorCircle;