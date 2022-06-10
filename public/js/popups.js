export function mensaje($error){
    setTimeout(()=>{
        $error.innerHTML = '';
    }, 5000);
}