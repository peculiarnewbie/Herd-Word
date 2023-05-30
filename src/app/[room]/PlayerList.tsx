import React, { useEffect, useState } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import './styles.css';


export default function PlayerList({players}: {players:string[]}){
    const [playersArr, setPlayersArr] = useState(['']);

    useEffect(() => {
        setPlayersArr(players);
    }, [])

    return(
        <>
            <ScrollArea.Root className="ScrollAreaRoot">
                <ScrollArea.Viewport className="ScrollAreaViewport">
                <div style={{ padding: '15px 20px' }}>
                    <div className="Text">Players</div>
                    {playersArr.map((tag) => (
                    <div className="Tag" key={tag}>
                        {tag}
                    </div>
                    ))}
                </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
                <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner className="ScrollAreaCorner" />
            </ScrollArea.Root>
            <p>there's {playersArr.length} players</p>
        </>
    )
}