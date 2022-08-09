import create from "zustand"

interface AlertProps {
    id : string,
    type: "Success" | "Failure" | "Warning";
    show : (type : "Success" | "Failure" | "Warning", child : React.ReactNode, closeAfter ?: number,) => void;
    child : React.ReactNode;
    open : boolean;
    close : ()=> void;
}

const useAlert = create<AlertProps>((set) => ({
    id : "1",
    type : "Success",
    show : (type, child, closeAfter) => {
        if(type == "Success" && closeAfter != undefined){
            setTimeout(()=>set({open : false}),closeAfter)
        }
        return set({type, child, open : true})},
    open : false,
    child : null,
    close : () => set({open : false})
  }))

export default useAlert;