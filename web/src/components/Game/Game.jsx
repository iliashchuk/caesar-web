import { useContext } from 'react';

import {
    ActiveStateProvider,
    GameContext,
    SizingContext,
    TurnStateProvider,
} from '../../context';
import { Map } from '../Map';
import { TurnManager } from '../TurnManager';
import styles from './Game.module.scss';

export function Game() {
    const { scale } = useContext(SizingContext);
    const { gameInProgress, initialState, initialPlayer } =
        useContext(GameContext);

    return (
        <div className={styles.container}>
            <Map blur={!gameInProgress} />
            {gameInProgress && scale ? (
                <TurnStateProvider
                    initialState={initialState}
                    initialPlayer={initialPlayer}
                >
                    <ActiveStateProvider>
                        <TurnManager />
                    </ActiveStateProvider>
                </TurnStateProvider>
            ) : (
                <h1 className={styles.waiting}>Waiting for another player</h1>
            )}
        </div>
    );
}
