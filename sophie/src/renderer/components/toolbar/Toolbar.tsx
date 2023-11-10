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

    const [toolbarDirection, setToolbarDirection] = useState("horizontal");
    const [toolbarRemainingX, setToolbarRemainingX] = useState<number | null>(null);
    const [toolbarPosition, setToolbarPosition] = useState<Position>({x: 0, y: 0});
    const [initialOverflow, setInitialOverflow] = useState<Boolean>(false);
    const [menuDesiredTranslation, setMenuDesiredTranslation] = useState<number | null>(null);
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
            const toolbarRightEdge = Math.round(toolbarRect.right);

            const menuRect = menuElement.getBoundingClientRect();
            const menuRightEdge = Math.round(menuRect.right);


            const isOverflow = menuRightEdge > rightBound;
            const remainingDragSpace = window.innerWidth - toolbarRightEdge;
            
            // Menu translation
            const transform = window.getComputedStyle(menuElement).transform;
            const transformValues = transform.match(/matrix.*\((.+)\)/);
            const translateX = transformValues ? parseFloat(transformValues[1].split(', ')[4]) : 0;

            let translation = translateX;
            
            let dragDirection = 'N';


            if( toolbarRemainingX && toolbarRemainingX > remainingDragSpace){
                dragDirection = 'R';
            }

            if( toolbarRemainingX && toolbarRemainingX < remainingDragSpace){
                dragDirection = 'L';
            }

            if (translation === 0 && !isOverflow){
                setInitialOverflow(false);
            }


            if (dragDirection !== 'N'){
                
                console.log({   
                    menuDesiredTranslation: menuDesiredTranslation,
                    translation: translation,
                    dragDirection: dragDirection,
                    isOverflow: isOverflow,
                    initialOverflow: initialOverflow,
                    toolbarRightEdge: toolbarRightEdge
                })

                if (dragDirection === 'R' && isOverflow){

                    if (!initialOverflow) {
                        // This is the first point we would've overflowed at.
                        // We save the remainingDragSpace here because this will be our desired ending translation
                        // if we were to drag all the way to the boundary.
                        setMenuDesiredTranslation(-remainingDragSpace);
                        setInitialOverflow(true)
                    }

                    translation -= 1;
                    menuElement.style.transform = `translateX(${translation}px)`;
                }

                if (dragDirection === 'L' && translation < 0 && !isOverflow ){
                    translation += 1
                    menuElement.style.transform = `translateX(${translation}px)`;
                }




            }
            
            if (dragDirection === 'N' && isOverflow)
            {
                
                //check translation
                //in some cases when menus are drag rapidly. We miss some translation calculations
                if(menuDesiredTranslation && translation > menuDesiredTranslation + remainingDragSpace){
                    //fix error
                    menuElement.style.transform = `translateX(${menuDesiredTranslation + remainingDragSpace}px)`;
                console.log(
                    "dragging on bound",
                    {   
                        menuDesiredTranslation: menuDesiredTranslation,
                        translation: translation,
                        dragDirection: dragDirection,
                        isOverflow: isOverflow,
                        toolbarRightEdge: toolbarRightEdge
                    }
                    )
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


    useEffect(() => {
        // Update the bounds on component mount and window resize
        updateBounds();
        window.addEventListener('resize', updateBounds);

        // Remove the event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateBounds);
        }
      }, [updateBounds]);
    

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



        const toolbarElement = toolbarRef.current;
        if (toolbarElement){
            const toolbarRect = toolbarElement.getBoundingClientRect();
            setToolbarRemainingX(window.innerWidth - toolbarRect.right)
        }

        setToolbarPosition({x: data.x, y: data.y});

    };

    

    return(
        <Draggable 
            bounds={bounds} 
            handle=".toolbar" 
            disabled={disableDrag}
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