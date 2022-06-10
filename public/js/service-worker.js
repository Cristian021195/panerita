export const navServiceWorker = existeSW();

function existeSW(){
    if('serviceWorker' in navigator){
        return navigator.serviceWorker.register('sw.js').then((res)=>{console.log('ok')}).catch(e=>{console.log(e)});
    }else{
        return new Error();
    }
}