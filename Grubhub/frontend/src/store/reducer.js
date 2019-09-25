const initialState = {
    buyer: {
        name :"",
        email: "",
        password: "",
        phone:""
    },
    owner: {
        ownerName:"",
        ownerEmail:"",
        ownerPhone:"",
        ownerPassword: "",
        restaurantName: "",
        restaurantZip: "",
        cuisine: ""
    }
}


const reducer = ( state = initialState, action ) =>{
    const newState = {...state};

    if(action.type === "HANDLE_USER_INPUT"){
        newState['buyer'][action.event.target.name] = action.event.target.value;
        
    }
    if(action.type === "HANDLE_OWNER_INPUT"){
        newState['owner'][action.event.target.name] = action.event.target.value;
        
    }
    
    return newState;
}

export default reducer;