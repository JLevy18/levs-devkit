import '../../styles/Toolbar.css';
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import ToolbarOption from './ToolbarOption';
import SettingsMenu from './menus/SettingsMenu';

import { BsEraser } from 'react-icons/bs';
import { TbSquareLetterT } from 'react-icons/tb';
import { LuX, LuSettings, LuTrash2, LuPencil, LuUndo2, LuRedo2, LuSave, LuShapes } from 'react-icons/lu';



const categories = ["Draw", "Format", "Utility", "Settings"];

const options = [
    { category: "Draw", id: "free", icon: <LuPencil />, menu: null },
    { category: "Draw", id: "shapes", icon: <LuShapes />, menu: null },
    { category: "Draw", id: "eraser", icon: <TbSquareLetterT />, menu: null },
    { category: "Draw", id: "text-box", icon: <BsEraser />, menu: null },
    { category: "Format", id: "draw-color", icon: null, menu: null },
    { category: "Utility", id: "undo", icon: <LuUndo2 /> , menu: null },
    { category: "Utility", id: "redo", icon: <LuRedo2 /> , menu: null },
    { category: "Utility", id: "clear", icon: <LuTrash2 /> , menu: null },
    { category: "Utility", id: "save", icon: <LuSave /> , menu: null },
    { category: "Settings", id: "settings", icon: <LuSettings />, menu: <SettingsMenu id="settings" toggleDirection={() => {}}/> },
    { category: "Settings", id: "hide", icon: <LuX />, menu: null },
    
 ];


const Toolbar: React.FC = () => {

    const [toolbarDirection, setToolbarDirection] = useState("horizontal");
    const [disableDrag, setDisableDrag] = useState(false);

    const handleOptionMouseEnter = () => {
        setDisableDrag(true);
    }

    const handleOptionMouseLeave = () => {
        setDisableDrag(false);
    }

    const handleDirectionToggle = () => {
        console.log("test")
        setToolbarDirection(toolbarDirection === "vertical" ? "horizontal" : "vertical");
    };

    return(
        <Draggable bounds="parent" handle=".toolbar" disabled={disableDrag}>
            <div className={`toolbar ${toolbarDirection}`}>
            {categories.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                {categoryIndex > 0 && <div className="separator" />}
                {options
                    .filter((option) => option.category === category)
                    //.sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((option, optionIndex) => (
                    <ToolbarOption 
                        key={optionIndex} 
                        option={option} 
                        toggleDirection={handleDirectionToggle}
                        onMouseEnter={handleOptionMouseEnter}
                        onMouseLeave={handleOptionMouseLeave}
                    />
                    ))}
                </React.Fragment>
            ))}
            </div>
        </Draggable>
    );
};

export default Toolbar;