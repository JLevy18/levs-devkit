// ToolbarOption.tsx
import React, { useEffect, useRef, useState } from "react";
import SettingsMenu from "./menus/SettingsMenu";

interface ToolbarOptionProps {
  option: {
    icon: JSX.Element | null;
    category: string;
    id: string;
  };
  menuRef: React.RefObject<HTMLDivElement>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  toggleDirection: () => void;
  updateMaxOverflow: () => void;
  calculateMenuPosition: (menuRef: React.RefObject<HTMLDivElement>) => void; 
}

const ToolbarOption: React.FC<ToolbarOptionProps> = ({ 
  option,
  menuRef,
  onMouseEnter,
  onMouseLeave, 
  toggleDirection,
  updateMaxOverflow,
  calculateMenuPosition,
}) => {

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    if(showMenu){
      updateMaxOverflow();
    }

  }, [showMenu]);


  useEffect(() => {

    if (showMenu) {
      calculateMenuPosition(menuRef);
    }

  }, [showMenu, calculateMenuPosition]);



  return (
    <div 
      id={option.id} 
      className={`toolbar-option ${showMenu ? "selected" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={toggleMenu}
    >
      {option.icon}
      {showMenu && option.id === "settings" && (
        <SettingsMenu ref={menuRef} id={`menu-${option.id}`} toggleDirection={toggleDirection} />
      )}
      {showMenu && option.id === "draw-color" && (
        <SettingsMenu ref={menuRef}id={option.id} toggleDirection={toggleDirection} />
      )}
    </div>
  );
};

export default ToolbarOption;