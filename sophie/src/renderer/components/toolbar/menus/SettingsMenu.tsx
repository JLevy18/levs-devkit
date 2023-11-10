import React, { forwardRef, useEffect, useState } from "react";


interface SettingsMenuProps {
  id: string;
  toggleDirection: () => void;
}

const SettingsMenu = forwardRef<HTMLDivElement, SettingsMenuProps>(({ id, toggleDirection }, ref) => {

    return (
      <div id={id} 
          className="menu-container" 
          onClick={(e) => {e.stopPropagation()}}
          ref={ref}
      >
        <h1 className="text-neutral-100 text-sm font-semibold tracking-wider text-center underline underline-offset-8 m-1 select-none" >Settings</h1>
        <div className="flex justify-center items-center flex-row-reverse">
          <label className="text-neutral-300 text-xs whitespace-nowrap p-1 select-none">
              Toggle Toolbar Direction
          </label>
          <button onClick={toggleDirection}
            className="h-5 w-10 bg-blue-600 rounded-xl mr-1"
          />
        </div>
      </div>
    );
  }
);

export default SettingsMenu;