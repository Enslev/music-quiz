import { styled } from '@mui/material';
import React from 'react';


export const InvalidDeviceToast: React.FC = () => {
    return <div>
        <Row>Spotify session closed on device.</Row>
        <Row>Open settings in the top left to select a new one.</Row>
    </div>;
};

const Row = styled('span')(({ display: 'block' }));
