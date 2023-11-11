import '../../styles/Toolbar.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import ToolbarOption from './ToolbarOption';

import { BsEraser } from 'react-icons/bs';
import { TbSquareLetterT } from 'react-icons/tb';
import { LuX, LuSettings, LuTrash2, LuPencil, LuUndo2, LuRedo2, LuSave, LuShapes } from 'react-icons/lu';
import { Bounds, Position } from '../types';


const GLOBAL_PADDING = 4;

const categories = ["Draw", "Format", "Utility", "Settings"];

const options = [
    { category: "Draw", id: "free", icon: <LuPencil />},
    { category: "Draw", id: "shapes", icon: <LuShapes />},
    { category: "Draw", id: "eraser", icon: <TbSquareLetterT />},
    { category: "Draw", id: "text-box", icon: <BsEraser />},
    { category: "Format", id: "draw-color", icon: null},
    { category: "Utility", id: "undo", icon: <LuUndo2 /> },
    { category: "Utility", id: "redo", icon: <LuRedo2 />},
    { category: "Utility", id: "clear", icon: <LuTrash2 />},
    { category: "Utility", id: "save", icon: <LuSave />},
    { category: "Settings", id: "settings", icon: <LuSettings />},
    { category: "Settings", id: "hide", icon: <LuX />},
];


const Toolbar: React.FC = () => {


    const toolbarRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    
    const [disableDrag, setDisableDrag] = useState(false);
    const [toolbarDirection, setToolbarDirection] = useState("horizontal");
    const [toolbarPosition, setToolbarPosition] = useState<Position>({x: 0, y: 0});

    const [menuMaxOverflow, setMenuMaxOverflow] = useState<number>(0);
    const [menuOnBoundary, setMenuOnBoundary] = useState<Boolean>(false);
  
    const calculateMenuPosition = useCallback((menuRef: React.RefObject<HTMLDivElement>) => {
        const menuElement = menuRef.current;
        const toolbarElement = toolbarRef.current;
        const rightBound = window.innerWidth;
    
        if (menuElement && toolbarElement) {

            const toolbarRect = toolbarElement.getBoundingClientRect();
            const toolbarRightEdge = Math.round(toolbarRect.right);
            const toolbarRemainDrag = (rightBound - toolbarRightEdge);

            const menuRect = menuElement.getBoundingClientRect();
            const menuRightEdge = Math.round(menuRect.right);
            
            // Menu translation
            const transform = window.getComputedStyle(menuElement).transform;
            const transformValues = transform.match(/matrix.*\((.+)\)/);
            const translateX = transformValues ? parseFloat(transformValues[1].split(', ')[4]) : 0;

            let translation = translateX || 0;
            let overflowing = (rightBound - menuRightEdge) < 0;

            if (overflowing && toolbarRemainDrag >= 0) {

                translation = -(menuMaxOverflow - (rightBound - toolbarRightEdge));
                menuElement.style.transform = `translateX(${translation}px)`;

                // console.log("Approach",{
                //     menuMaxOverflow: menuMaxOverflow,
                //     translation: -(menuMaxOverflow - (rightBound - toolbarRightEdge)),
                //     toolbarRemainDrag: rightBound - toolbarRightEdge,
                //     overflowing: overflowing,
                //     onBoundary: menuOnBoundary
                // })

            }else if (!overflowing && toolbarRemainDrag <= menuMaxOverflow) {
                
                translation = -(menuMaxOverflow - (rightBound - toolbarRightEdge));
                menuElement.style.transform = `translateX(${translation}px)`;

                // console.log("Leaving",{
                //     menuMaxOverflow: menuMaxOverflow,
                //     translation: -(menuMaxOverflow - (rightBound - toolbarRightEdge)),
                //     toolbarRemainDrag: rightBound - toolbarRightEdge,
                //     overflowing: overflowing,
                // })
            }


        
        } 
    }, [toolbarPosition, menuMaxOverflow]);

    const handleDirectionToggle = () => {
        setToolbarDirection(toolbarDirection === "vertical" ? "horizontal" : "vertical");
    };

    const handleOptionMouseEnter = () => {
        setDisableDrag(true);
    }

    const handleOptionMouseLeave = () => {
        setDisableDrag(false);
    }

    const handleUpdateMaxOverflow = () => {
        const menuElement = menuRef.current;
        const toolbarElement = toolbarRef.current;
        const rightBound = window.innerWidth;

        if(menuElement && toolbarElement){

            const menuRightEdge = Math.round(menuElement.getBoundingClientRect().right);
            const toolbarRightEdge = Math.round(toolbarElement.getBoundingClientRect().right);
            setMenuMaxOverflow((rightBound - toolbarRightEdge) - (rightBound - menuRightEdge));
        }

        
        
    }

    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        setToolbarPosition({x: data.x, y: data.y});
    };

    return(
        <Draggable 
            bounds="parent" 
            handle=".toolbar" 
            disabled={disableDrag}
            position={toolbarPosition}
            onDrag={handleDrag}
            onStop={handleDrag}
        >
            <div ref={toolbarRef} className={`toolbar ${toolbarDirection}`}>
                {categories.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                        {categoryIndex > 0 && <div className="separator" />}
                        {options
                            .filter((option) => option.category === category)
                            //.sort((a, b) => (a.order || 0) - (b.order || 0))
                            .map((option) => (
                            <ToolbarOption 
                                key={option.id} 
                                option={option}
                                toggleDirection={handleDirectionToggle}
                                onMouseEnter={handleOptionMouseEnter}
                                onMouseLeave={handleOptionMouseLeave}
                                
                                menuRef={menuRef}
                                calculateMenuPosition={calculateMenuPosition}
                                updateMaxOverflow={handleUpdateMaxOverflow}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </Draggable>
    );
};

export default Toolbar;