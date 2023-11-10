import '../../styles/Toolbar.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import ToolbarOption from './ToolbarOption';

import { BsEraser } from 'react-icons/bs';
import { TbSquareLetterT } from 'react-icons/tb';
import { LuX, LuSettings, LuTrash2, LuPencil, LuUndo2, LuRedo2, LuSave, LuShapes } from 'react-icons/lu';
import { Bounds, Position } from '../types';
import { throttle } from '../util/throttle';


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

    const [toolbarDirection, setToolbarDirection] = useState("horizontal");
    const [maxOverflow, setMaxOverflow] = useState<number | null>(null);
    const [toolbarPosition, setToolbarPosition] = useState<Position>({x: 0, y: 0});
    const [disableDrag, setDisableDrag] = useState(false);
    const [bounds, setBounds] = useState<Bounds>({
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    });
  
    const calculateMenuPosition = useCallback((menuRef: React.RefObject<HTMLDivElement>) => {
        const menuElement = menuRef.current;
        const toolbarElement = toolbarRef.current;
        const rightBound = window.innerWidth - GLOBAL_PADDING;
    
        if (menuElement && toolbarElement) {
            const toolbarRect = toolbarElement.getBoundingClientRect();
            const menuRect = menuElement.getBoundingClientRect();
            
            const menuRightEdge = Math.round(menuRect.right);
            const toolbarRightEdge = Math.round(toolbarRect.right);

            const isOverflow = menuRightEdge > rightBound;
            const remainingDragSpace = window.innerWidth - toolbarRightEdge;

            const transform = window.getComputedStyle(menuElement).transform;
            const transformValues = transform.match(/matrix.*\((.+)\)/);
            const translateX = transformValues ? parseFloat(transformValues[1].split(', ')[4]) : 0;

            let translation = translateX;
            console.log({   
                            remainingSpace: remainingDragSpace,
                            translation: translation,
                            maxOverflow: maxOverflow,
                            isOverflow: isOverflow,
                        })
            if (isOverflow) {
                translation -= 1;
                menuElement.style.transform = `translateX(${translation}px)`;
            }

            if (remainingDragSpace <= 2 && maxOverflow === null){
                setMaxOverflow(translateX * -1);
            }
            
            if (remainingDragSpace > 2 && translation < 0 && maxOverflow) {
                translation += 1
                console.log({potentialTanslation: translation});
                menuElement.style.transform = `translateX(${translation}px)`;

                if(translation === 0){
                    setMaxOverflow(null);
                }

            }

        }
    }, [toolbarPosition]);


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

    const resetOverflow = useCallback(() => {
        setMaxOverflow(null);

    }, []);
    useEffect(() => {
        // Update the bounds on component mount and window resize
        updateBounds();
        window.addEventListener('resize', updateBounds);
        window.addEventListener('resize', resetOverflow);

        // Remove the event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateBounds);
            window.removeEventListener('resize', resetOverflow);
        }
      }, [updateBounds, resetOverflow]);
    

    const handleOptionMouseEnter = () => {
        setDisableDrag(true);
    }

    const handleOptionMouseLeave = () => {
        setDisableDrag(false);
    }

    const handleDirectionToggle = () => {
        setToolbarDirection(toolbarDirection === "vertical" ? "horizontal" : "vertical");
    };

    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        updateBounds();
        setToolbarPosition({x: data.x, y: data.y});
    };

    

    return(
        <Draggable 
            bounds={bounds} 
            handle=".toolbar" 
            disabled={disableDrag}
            onDrag={handleDrag}
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
                                calculateMenuPosition={calculateMenuPosition}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </Draggable>
    );
};

export default Toolbar;