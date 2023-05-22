export default function Change(string){
    try{
    if(string?.length > 10){
            let firstFour = string.slice(0,4);
    let lastFour  = string.slice(-4);
    let subString = firstFour + "..." + lastFour;
    return subString;
    }else{
        return string
    } 
}catch(e){
    console.log(e)
}
};

