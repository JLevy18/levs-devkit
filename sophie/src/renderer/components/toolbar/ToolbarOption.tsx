// ToolbarOption.tsx
import React, { useState } from "react";
import SettingsMenu from "./menus/SettingsMenu";

interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface Position {
  x: number;
  y: number;
}

interface ToolbarOptionProps {
  option: {
    icon: JSX.Element | null;
    category: string;
    id: string;
  };
  menuBounds: Bounds;
  toolbarPostion: Position;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  toggleDirection: () => void;
}

const ToolbarOption: React.FC<ToolbarOptionProps> = ({ 
  option,
  menuBounds,
  toolbarPostion,
  onMouseEnter,
  onMouseLeave, 
  toggleDirection 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

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
        <SettingsMenu id={option.id} toggleDirection={toggleDirection} />
      )}
      {showMenu && option.id === "draw-color" && (
        <SettingsMenu id={option.id} toggleDirection={toggleDirection} />
      )}
    </div>
  );
};

export default ToolbarOption;