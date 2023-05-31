import './styles.css'

export default function OptionalButton({show, text, onClick}: {show:boolean, text:string, onClick:any}){
    if(show){
        return(
            <button type="button" className="Button" onClick={onClick} style={{ marginTop: 10 }}>
                {text}
            </button>
        )
    }
    else{
        return(
            null
        )
    }
}