import './style.css'
import effectualLogo from '/logo.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
  
  
    <h1>Physics Interactive 3D Simulations</h1>
   
 
   
    <p>A virtual 3D learning platform at Effectuall. Provides an effective and powerful 3D learning platform for Interactive Physics Simulations.
      It introduces a teaching methodology that uses technology as access points for guiding students in science.</p>
    
			<h2>Explore. Evaluate. Envision.</h2>
			<a href="https://effectuall.github.io/" target="_blank"><button >Find Out More</button></a>
			
      <h3>Effect of Visual Learning -  Effectual Learning </h3>
 
  </div>
  </div>
`



document.querySelector('#counterCard').innerHTML = `
<div><a href="https://www.youtube.com/channel/UCFSMjn_YssD7Y1ybBwZb3mw" target="_blank">
<img src="${effectualLogo}" class="logo" alt="Effectual logo" />
</a></div>
<p class="read-the-docs">
Click on the Effectual Learning logo for video tutorials
</p>

<p> Content still in development. The interactive 3D simulation created using open source Three.js-JavaScript 3D Library.
© Copyright 2020 by E.P Sajitha (Ph.D). All rights reversed. Any suggestion appreciated. </p>
<p>Email: effectuallearning@gmail.com</p>
<div class="card">
<button id="counter" type="button"></button>
</div>
`
setupCounter(document.querySelector('#counter'))

