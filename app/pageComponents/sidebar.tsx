import React from 'react'
import genshindb from 'genshin-db';

interface passedData {
    charList: genshindb.Character[];
    sendData: (newChar: genshindb.Character) => void;
}


const sidebar: React.FC<passedData> = ({charList, sendData}) => {
    return(
        <div className = "border-r-2 w-48 min-h-screen overflow-y-auto" id = "sidebar">
        <ul className = "space-y-4" id = "sidebarList">
          {charList.map((character) => (
            <li
              key = {character.name}
              className = "p-2 cursor-pointer hover:bg-gray-200 rounded"
              onClick = {() => sendData(character)}
            >
              {character.name}
            </li>
          ))}
        </ul>
      </div>
    )
}
export default sidebar;