import {useState, useEffect} from "react";
import {isAuthenticated, getToken} from "../config/credentials";


export default () => {
    const [state, setState] = useState({
        
    });

    useEffect(() => {
        if(!isAuthenticated()) {
            console.log(isAuthenticated());
            setState({
                isAuthenticated: isAuthenticated(),
            });
        } else {
            getToken().then((data) => {
                setState(data);
            })
        }

        return () => {};
    });


    return [state, setState]

}