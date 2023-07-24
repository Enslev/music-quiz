import { FormControl, InputLabel, Select, MenuItem, styled, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { RightMenu } from '../RightMenu';
import { SpotiyDeviceObject } from '../../overmind/effects/api/spotify/types';
import { useAppState, useActions } from '../../overmind';

import { ReactComponent as RefreshIconRaw } from '../../assets/refresh-cw.svg';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const SettingsMenu: React.FC<Props> = (props) => {

    const { open, onClose } = props;
    const state = useAppState();

    const { setSelectedDevice, getAvailableDevices } = useActions().spotify;
    const [ deviceValue, setDeviceValue ] = useState<string>('');
    const [ availableDevices, setAvailableDevices ] = useState<SpotiyDeviceObject[]>([]);

    const [ rotateRefresh, setRotateRefresh ] = useState<boolean>(false);

    useEffect(() => {
        if (!open) return;

        (async () => {
            await refreshAvailableDevices();
            setDeviceValue(state.selectedDevice?.id ?? '');
        })();
    }, [ open ]);


    const refreshAvailableDevices = async () => {
        const devicesFromSpotify = await getAvailableDevices();
        setAvailableDevices(devicesFromSpotify);
    };

    const onDeviceChange = (event: SelectChangeEvent) => {
        const foundDevice = availableDevices.find((device) => device.id == event.target.value);
        if (!foundDevice) return;

        setSelectedDevice(foundDevice);
        setDeviceValue(foundDevice.id);
    };

    return <RightMenu
        open={open}
        onClose={onClose}
    >
        <h1>Settings</h1>
        <SelectDeviceWrapper>
            <FormControl fullWidth>
                <InputLabel id="device-select-label">Device</InputLabel>
                <Select
                    labelId="device-select-label"
                    id="device-select"
                    value={deviceValue}
                    label="device"
                    onChange={onDeviceChange}
                    placeholder='Device'
                >
                    {availableDevices?.map((device) =>
                        <MenuItem
                            key={device.id}
                            value={device.id}
                        >
                            {device.name}
                        </MenuItem>)
                    }
                </Select>
            </FormControl>
            <RefreshIcon
                onTransitionEnd={() => setRotateRefresh(false)}
                onClick={() => {
                    if (rotateRefresh) return;

                    setRotateRefresh(true);
                    refreshAvailableDevices();
                }}
                className={rotateRefresh ? 'rotate':  ''}
            />
        </SelectDeviceWrapper>
    </RightMenu>;
};

const SelectDeviceWrapper = styled('div')(({
    display: 'flex',
    alignItems: 'center',
}));

const RefreshIcon = styled(RefreshIconRaw)(({ theme }) => ({
    width: '25px',
    height: '25px',
    cursor: 'pointer',
    transition: '200ms',
    transitionProperty: 'transform',
    transitionDuration: '0ms',
    color: 'white',
    marginLeft: '20px',

    '&:hover': {
        scale: '1.05',
        color: theme.palette.primary.main,
    },

    '&.rotate':  {
        transform: 'rotate(180deg);',
        transitionProperty: 'transform',
        transitionDuration: '1000ms',
    },
}));
