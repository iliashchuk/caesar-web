import { useDroppable } from '@dnd-kit/core';
import classnames from 'classnames';
import { useContext, useEffect, useMemo, useState } from 'react';
import { OutPortal } from 'react-reverse-portal';

import { SizingContext, TurnState } from '../../context';
import { Token } from '../Token';
import styles from './Location.module.scss';

export function Location({ location }) {
    const { locationSize } = useContext(SizingContext);
    const { activeState, establishedState } = useContext(TurnState);
    const [flipped, setFlipped] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const establishedLocationToken = establishedState[location.name];
    const activeLocationToken = activeState[location.name];

    const { setNodeRef, active } = useDroppable({
        id: location.name,
        disabled,
    });

    const translateFunction = `translate(-${locationSize / 2}px,-${
        locationSize / 2
    }px`;
    const style = {
        width: locationSize,
        height: locationSize,
        transform: translateFunction,
        left: location.x * 100 + '%',
        top: location.y * 100 + '%',
    };

    useEffect(() => {
        if (!establishedLocationToken || activeLocationToken) {
            setFlipped(false);
        }
    }, [establishedLocationToken, activeLocationToken, setFlipped]);

    const draggedTokenType = active?.data.current.type;

    useEffect(() => {
        if (establishedLocationToken || !draggedTokenType) {
            setDisabled(true);
            return;
        }

        if (draggedTokenType === location.type) {
            setDisabled(false);
            return;
        }
    }, [draggedTokenType, establishedLocationToken, location.type]);

    const childToken = useMemo(() => {
        if (establishedLocationToken) {
            const rotate =
                (flipped ? location.angle + 180 : location.angle) + 'deg';

            return <Token style={{ rotate }} {...establishedLocationToken} />;
        }
        if (activeLocationToken) {
            return (
                <OutPortal
                    node={activeLocationToken.portalNode}
                    rotation={flipped ? location.angle + 180 : location.angle}
                    toggleFlipped={() => {
                        setFlipped(!flipped);
                    }}
                />
            );
        }
    }, [
        establishedLocationToken,
        activeLocationToken,
        flipped,
        location.angle,
    ]);

    return (
        <div
            ref={setNodeRef}
            onClick={() => {
                alert(location.name);
            }}
            key={location.name}
            className={classnames(styles.location, {
                [styles.available]: !disabled,
            })}
            style={style}
        >
            {childToken}
        </div>
    );
}