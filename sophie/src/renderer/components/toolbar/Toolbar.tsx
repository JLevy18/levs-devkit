import '../../styles/Toolbar.css';
import Draggable from 'react-draggable';
import { CgClose } from 'react-icons/cg';
import { SlSettings, SlPencil, SlTrash } from 'react-icons/sl';
import ColorSelection from './ColorSelection';

export default function Toolbar() {
    return (
        <Draggable bounds='parent' handle='#toolbar'>        
            <div id='toolbar'>
                {/* Draw Modes */}

                <SlPencil 
                    className='option modes' 
                    id='draw' 
                    color='white' 
                />

                <div id='separator'/>

                {/* Mode Configuration */}

                <ColorSelection 
                    className='option config'
                    color='#DB2777'
                    id='active-color'
                />

                <div id='toolbar-menu'>
                    <div id='color-options'>
                        <div className='color-option bg-red-500'       />
                        <div className='color-option bg-orange-500'    />
                        <div className='color-option bg-yellow-500'    />
                        <div className='color-option bg-lime-500'      />
                        <div className='color-option bg-green-500'     />
                        <div className='color-option bg-cyan-500'      />
                        <div className='color-option bg-blue-500'      />
                        <div className='color-option bg-violet-500'    />
                        <div className='color-option bg-pink-500'      />

                        <div className='color-option bg-red-600'       />
                        <div className='color-option bg-orange-600'    />
                        <div className='color-option bg-yellow-600'    />
                        <div className='color-option bg-lime-600'      />
                        <div className='color-option bg-green-600'     />
                        <div className='color-option bg-cyan-600'      />
                        <div className='color-option bg-blue-600'      />
                        <div className='color-option bg-violet-600'    />
                        <div className='color-option bg-pink-600'      />

                        <div className='color-option bg-red-700'       />
                        <div className='color-option bg-orange-700'    />
                        <div className='color-option bg-yellow-700'    />
                        <div className='color-option bg-lime-700'      />
                        <div className='color-option bg-green-700'     />
                        <div className='color-option bg-cyan-700'      />
                        <div className='color-option bg-blue-700'      />
                        <div className='color-option bg-violet-700'    />
                        <div className='color-option bg-pink-700'      />
                    </div>
                </div>

                <div id='separator'/>

                {/* App Utility */}

                <SlTrash
                    className='option util' 
                    id='settings' 
                    color='white'
                />

                <SlSettings 
                    className='option util' 
                    id='settings' 
                    color='white'
                />
                <CgClose 
                    className='option util' 
                    id='hide' 
                    color='white'
                />
            </div>
        </Draggable>

    )
}