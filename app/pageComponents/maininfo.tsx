import React from 'react'
import genshindb from 'genshin-db';

interface passedData {
    character: genshindb.Character | null;
}

const maininfo: React.FC<passedData> = ({character}) => {
    return (
        <div className = "flex flex-auto justify-center items-center max-w-screen" id = "mainInfo">
          {(!character ? (
            <h2>Choose a character.</h2>
          ) : (
            <>
              <h1>{character.name}</h1>
              <img src = {character.images.hoyowiki_icon} />
            </>
          )) }
      </div>
    )
}

export default maininfo;