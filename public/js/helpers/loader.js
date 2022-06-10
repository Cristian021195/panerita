/*export function loader(size, speed, color='#0d6efd'){
    const $loader = document.createElement('div'); $loader.style.width = `${size}px`;
    $loader.innerHTML = `<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
      <path fill="${color}" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
        <animateTransform 
           attributeName="transform" 
           attributeType="XML" 
           type="rotate"
           dur="${speed}s" 
           from="0 50 50"
           to="360 50 50" 
           repeatCount="indefinite" />
      </path>
      </svg>`;
      return $loader;
}*/
export function loader(size, speed, color="#0d6efd"){
  const $loader = document.createElement('div');
  $loader.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgba(0,0,0,0); display: block; shape-rendering: auto;" width="${size}px" height="${size}px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <circle xmlns="http://www.w3.org/2000/svg" cx="50" cy="50" fill="none" stroke="${color}" stroke-width="14" r="37" stroke-dasharray="174.35839227423352 60.119464091411174">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="${speed}s" values="0 50 50;360 50 50" keyTimes="0;1"/>
      </circle>
    <svg/>
  `;

  return $loader;
}