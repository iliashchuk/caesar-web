import { AnimatePresence } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';

import { TokenMovement } from '../../context';
import { Location } from '../Locations';
import { AnimatedToken, Token } from '../Token';
import { WINNING_CONTROL_NUMBER } from '../../../../server/src/constants'

export function ControlSlots({ side, slots, controlNumber }) {
    const { activeMovement, finishMovement, updateAnimatedState } =
        useContext(TokenMovement);
    const [actualSlots, setActualSlots] = useState(
        slots.slice(0, WINNING_CONTROL_NUMBER - controlNumber),
    );
    const [movingTokenIndex, setMovingTokenIndex] = useState();

    useEffect(() => {
        if (
            activeMovement &&
            activeMovement.origin === 'control' &&
            activeMovement.token.side === side
        ) {
            setMovingTokenIndex(actualSlots.length - 1);
        }
    }, [activeMovement]);

    useEffect(() => {
        if (!activeMovement) {
            setActualSlots(
                slots.slice(0, WINNING_CONTROL_NUMBER - controlNumber),
            );
        }
    }, [slots, controlNumber, activeMovement]);

    function finishControlMovement() {
        updateAnimatedState({
            [activeMovement.destination.id]: activeMovement.token,
        });
        finishMovement();
        setActualSlots(actualSlots.slice(0, actualSlots.length - 1));
        setMovingTokenIndex();
    }

    return (
        <AnimatePresence>
            {actualSlots.map((location, index) =>
                activeMovement && index === movingTokenIndex ? (
                    <AnimatedToken
                        key={location.id}
                        {...activeMovement}
                        origin={location}
                        finishMovement={finishControlMovement}
                    />
                ) : (
                    <Location key={location.id} location={location}>
                        <Token token={{ side, id: 'control' }} make3d={false} />
                    </Location>
                ),
            )}
        </AnimatePresence>
    );
}
