/* Light is registered to the source photograph and zooms with its architecture. */
(()=>{'use strict';
const hero=document.querySelector('.home-hero'),art=hero?.querySelector('.hero-art'),canvas=art?.querySelector('.architecture-light'),photo=art?.querySelector('img');
if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)');let w=0,h=0,time=0,last=0,raf=0,visible=true;
const edges=[[[650,738],[983,105],[1121,68]],[[778,738],[1121,68],[1430,653]],[[900,735],[1095,298],[1274,647]]];
function trace(points,progress,brightness){
 const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));const total=lengths.reduce((a,b)=>a+b,0),head=progress*(total+320)-160;
 let distance=0;ctx.lineCap='round';
 for(let k=0;k<lengths.length;k++){
  const a=points[k],b=points[k+1],length=lengths[k];
  for(let d=0;d<length;d+=7){const alpha=Math.exp(-Math.pow((distance+d-head)/90,2))*brightness;if(alpha<.003)continue;const end=Math.min(length,d+8);
   ctx.beginPath();ctx.moveTo(a[0]+(b[0]-a[0])*d/length,a[1]+(b[1]-a[1])*d/length);ctx.lineTo(a[0]+(b[0]-a[0])*end/length,a[1]+(b[1]-a[1])*end/length);
   ctx.strokeStyle=`rgba(255,221,175,${alpha*.2})`;ctx.lineWidth=12;ctx.stroke();ctx.strokeStyle=`rgba(255,249,223,${alpha})`;ctx.lineWidth=2;ctx.stroke();
  }distance+=length;
 }
}
function draw(){
 ctx.clearRect(0,0,w,h);const scale=Math.max(w/1672,h/941);const pos=getComputedStyle(photo).objectPosition.split(' ');const factor=v=>v==='top'||v==='left'?0:v==='bottom'||v==='right'?1:v==='center'?.5:parseFloat(v)/100;
 const x=(w-1672*scale)*factor(pos[0]),y=(h-941*scale)*factor(pos[1]);ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.globalCompositeOperation='screen';
 // Warm reflected light stays within the opening, directly above the existing sunrise.
 ctx.save();ctx.beginPath();ctx.moveTo(900,735);ctx.lineTo(1095,298);ctx.lineTo(1274,647);ctx.lineTo(1274,735);ctx.closePath();ctx.clip();
 const pulse=.065+.045*(.5+.5*Math.sin(time*.38));const glow=ctx.createRadialGradient(990,669,5,990,669,300);glow.addColorStop(0,`rgba(255,221,161,${pulse*2.2})`);glow.addColorStop(.4,`rgba(255,201,133,${pulse})`);glow.addColorStop(1,'rgba(255,210,150,0)');ctx.fillStyle=glow;ctx.fillRect(850,300,500,450);ctx.restore();
 edges.forEach((edge,i)=>trace(edge,(time/(12+i*2)+i*.34)%1,i===2?.24:.48));ctx.restore();
}
function fit(){w=art.clientWidth;h=art.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function tick(now){if(last)time+=Math.min((now-last)/1000,.06);last=now;draw();raf=requestAnimationFrame(tick)}
function sync(){cancelAnimationFrame(raf);last=0;if(visible&&!document.hidden&&!reduced.matches&&!hero.classList.contains('motion-paused'))raf=requestAnimationFrame(tick);else draw()}
new ResizeObserver(fit).observe(art);new MutationObserver(sync).observe(hero,{attributes:true,attributeFilter:['class']});new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync()}).observe(hero);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);fit();sync();
})();
