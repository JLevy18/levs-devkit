import '../../styles/Toolbar.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import ToolbarOption from './ToolbarOption';
import SettingsMenu from './menus/SettingsMenu';

import { BsEraser } from 'react-icons/bs';
import { TbSquareLetterT } from 'react-icons/tb';
import { LuX, LuSettings, LuTrash2, LuPencil, LuUndo2, LuRedo2, LuSave, LuShapes } from 'react-icons/lu';


const GLOBAL_PADDING = 4;

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
    { category: "Settings", id: "settings", icon: <LuSettings />, menu: null },
    { category: "Settings", id: "hide", icon: <LuX />, menu: null },
];

interface Position {
    x: number;
    y: number;
}

interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}


const Toolbar: React.FC = () => {

    const [toolbarDirection, setToolbarDirection] = useState("horizontal"); 
    const [toolbarPosition, setToolbarPosition] = useState<Position>({x: 0, y: 0});
    const [disableDrag, setDisableDrag] = useState(false);
    const toolbarRef = useRef<HTMLDivElement | null>(null);
    const [bounds, setBounds] = useState<Bounds>({
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    });
  

    const updateBounds = useCallback(() => {
        const toolbar = toolbarRef.current;
        if (toolbar) {
          const rect = toolbar.getBoundingClientRect();
          const rightBound = window.innerWidth - rect.width - GLOBAL_PADDING;
          const bottomBound = window.innerHeight - rect.height - GLOBAL_PADDING;
          setBounds({
            left: 0,
            top: 0,
            right: rightBound,
            bottom: bottomBound,
          });
        }
      }, []);


    useEffect(() => {
        // Update the bounds on component mount and window resize
        updateBounds();
        window.addEventListener('resize', updateBounds);

        // Remove the event listener on component unmount
        return () => window.removeEventListener('resize', updateBounds);
      }, [updateBounds, toolbarPosition]);


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

    const onControlledDrag = (e: DraggableEvent, data: DraggableData) => {
        updateBounds();
        setToolbarPosition({x: data.x, y: data.y});
    };
    

    return(
        <Draggable 
            bounds={bounds} 
            handle=".toolbar" 
            disabled={disableDrag}
            onDrag={onControlledDrag}
        >
            <div ref={toolbarRef} className={`toolbar ${toolbarDirection}`}>
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