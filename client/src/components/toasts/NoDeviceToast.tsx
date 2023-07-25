import { styled } from '@mui/material';
import React from 'react';


export const NoDeviceToast: React.FC = () => {
    return <div>
        <Row>Device not selected.</Row>
        <Row>Open settings in the top left to set one.</Row>
    </div>;
};

const Row = styled('span')(({ display: 'block' }));
