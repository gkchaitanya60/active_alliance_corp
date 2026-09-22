/* Self-contained carousel, native transforms and SVG light trail. No CDN dependencies. */
(()=>{'use strict';
const hero=document.querySelector('.moving-perspectives');if(!hero)return;
const scene=hero.querySelector('.perspectives-scene'),stage=hero.querySelector('.perspectives-stage'),panels=[...hero.querySelectorAll('.perspective-panel')],dots=[...hero.querySelectorAll('[data-perspective]')],lights=[...hero.querySelectorAll('.orbit-dots>g')],status=hero.querySelector('.perspective-status'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
let current=2,from=2,target=2,transitionStart=0,transitionDuration=2.2,transitioning=false,elapsed=0,hold=0,last=0,raf=0,inView=true;
const labels=['Architecture','Teamwork','Enterprise infrastructure','Business applications','New possibilities'];
function resize(){const scale=Math.min(scene.clientWidth/900,(scene.clientHeight-30)/600,1.08);stage.style.setProperty('--scene-scale',scale.toFixed(4));}
resize();new ResizeObserver(resize).observe(scene);
const wrap=n=>((n+2.5)%5+5)%5-2.5;
function syncDots(){const n=((Math.round(current)%5)+5)%5;dots.forEach((d,i)=>d.setAttribute('aria-pressed',String(i===n)));}
function render(){panels.forEach((panel,i)=>{const offset=wrap(i-current),distance=Math.abs(offset),x=Math.sign(offset)*(distance<=1?177*distance:177+133*(distance-1)),z=92-distance*125,y=distance*12+Math.sin(elapsed*.65+i*.48)*3,angle=-7-offset*15,scale=1-distance*.125;panel.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) rotateY(${angle.toFixed(2)}deg) scale(${scale.toFixed(4)})`;panel.style.zIndex=String(Math.round(100-distance*25));panel.style.opacity=String(distance<=2?1:Math.max(0,1-(distance-2)*2));});lights.forEach((g,i)=>{const a=elapsed*.22+i*Math.PI/3;g.setAttribute('transform',`translate(${(450+416*Math.cos(a)).toFixed(2)} ${(524+43*Math.sin(a)).toFixed(2)})`);g.style.opacity=String(.55+.45*(Math.sin(a)+1)/2);});}
function move(delta,manual=false){from=current;target=current+delta;transitionStart=elapsed;transitioning=true;hold=0;transitionDuration=manual?.85:2.2;if(reduced.matches||hero.classList.contains('motion-paused')){current=target;transitioning=false;render();syncDots()}if(manual){status.textContent=labels[((Math.round(target)%5)+5)%5];}start();}
const canAnimate=()=>inView&&!document.hidden&&!hero.classList.contains('motion-paused')&&!reduced.matches;
function tick(now){raf=0;if(!canAnimate()){last=0;return}const dt=last?Math.min((now-last)/1000,.05):0;last=now;elapsed+=dt;if(transitioning){let p=Math.min(1,(elapsed-transitionStart)/transitionDuration);let ease=p*p*(3-2*p);current=from+(target-from)*ease;if(p>=1){current=((target%5)+5)%5;transitioning=false;hold=0;syncDots();}}else{hold+=dt;if(hold>4.0)move(1);}render();if(!raf)raf=requestAnimationFrame(tick);}
function start(){if(canAnimate()&&!raf){last=0;raf=requestAnimationFrame(tick)}}
function refresh(){if(!canAnimate()){if(raf)cancelAnimationFrame(raf);raf=0;last=0;}else start();}
hero.querySelector('.perspective-prev').addEventListener('click',()=>move(-1,true));hero.querySelector('.perspective-next').addEventListener('click',()=>move(1,true));dots.forEach((d,i)=>d.addEventListener('click',()=>move(wrap(i-current),true)));
scene.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowRight'?1:-1,true)}});
let pointer=null;scene.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.button!==0)return;pointer={x:e.clientX,y:e.clientY};});scene.addEventListener('pointerup',e=>{if(!pointer)return;let dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1,true)});scene.addEventListener('pointercancel',()=>pointer=null);scene.addEventListener('dragstart',e=>e.preventDefault());
new MutationObserver(refresh).observe(hero,{attributes:true,attributeFilter:['class']});reduced.addEventListener('change',refresh);document.addEventListener('visibilitychange',refresh);new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;refresh()},{threshold:.03}).observe(hero);render();syncDots();start();
})();
