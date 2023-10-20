import '../../styles/ColorSelection.css';

interface Props {
    className: string;
    id: string;
    color: string;
}

export default function ColorSelection({className, id, color}:Props) {
    return (
        <div id={id} className={className} style={{backgroundColor: color}}/>
    )
}