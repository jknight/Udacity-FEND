function checkPeriodicallyForScroll(){var a=document.body.scrollTop;a!=lastScrollTop&&0==updateCount&&rowCounter>0&&(intervalHandle=setInterval(updatePositions,50)),lastScrollTop=a}function handleScroll(){var a=document.body.scrollTop;document.body.scrollHeight==a+window.innerHeight&&createDivs()}function updatePositions(){if(updateCount>updateMax)return console.log("position update sequence complete"),updateCount=0,void clearTimeout(intervalHandle);for(var a=document.getElementsByClassName("rowDiv"),b=a.length,c=updateCount/updateMax>.6,d=updateMax-updateCount,e=0;b>e;e++)for(var f=a[e],g=60,h=g-g,i=f.offsetWidth-g,j=g-g,k=f.offsetHeight-g,l=f.childNodes,m=l.length,n=0;m>n;n++){var o=l[n];if(-1!=o.className.indexOf("floater")){var p=o.directionX,q=o.directionY,r=parseInt(o.style.left),s=parseInt(o.style.top),t=o.velocity;if(c){var u=t/d;t-=u,o.velocity=t}var v=p?r+t:r-t,w=q?s+t:s-t;(v>=i||h>=v)&&(o.directionX=!p),(w>=k||j>=w)&&(o.directionY=!q),o.style.left=v+"px",o.style.top=w+"px",0==d&&(o.velocity=o.initialVelocity)}}++updateCount}function createDivs(){var a=document.createElement("div");a.id=rowCounter,a.classList.add("row"),a.classList.add("rowDiv");for(var b=0;3>b;b++){var c=document.createElement("div");c.classList.add("contentItemOuter"),c.classList.add("col-md-4"),c.style.backgroundSize=currentPizzaWidth+"px";var d=document.createElement("h4");d.innerHTML=randomName(),c.appendChild(d);var e=document.createElement("ul");e.innerHTML=makeRandomPizza(),c.appendChild(e),a.appendChild(c)}for(var f=window.innerWidth/2,g=6,h=0;g>h;h++){var i=new Image;i.src="img/pizza50x65.png",i.directionX=direction,i.directionY=direction,i.classList.add("floater"),i.id="floater_"+rowCounter+"_"+h,i.style.left=f+"px",i.style.top="60px";var j=h+4;i.velocity=j,i.initialVelocity=j,a.appendChild(i)}direction=!direction;var k=document.getElementById("items");k.appendChild(a),++rowCounter}var container=document.getElementById("container"),currentPizzaWidth=232,direction=!1,rowCounter=0,isUpdating=!1,lastScrollTop=0,intervalHandle,updateCount=0,updateMax=100;window.addEventListener("scroll",handleScroll),window.setInterval(checkPeriodicallyForScroll,200);var ingredientItemizer=function(a){return"<li>"+a+"</li>"},makeRandomPizza=function(){for(var a="",b=Math.random(),c=Math.floor(4*b),d=Math.floor(3*b),e=Math.floor(2*b),f=0;c>f;f++)a+=ingredientItemizer(selectRandomMeat());for(var g=0;d>g;g++)a+=ingredientItemizer(selectRandomNonMeat());for(var h=0;e>h;h++)a+=ingredientItemizer(selectRandomCheese());return a+=ingredientItemizer(selectRandomSauce()),a+=ingredientItemizer(selectRandomCrust())},resizePizzas=function(a){function b(a){var b=document.getElementById("pizzaSize");switch(a){case"1":return void(b.innerHTML="Small");case"2":return void(b.innerHTML="Medium");case"3":return void(b.innerHTML="Large");default:console.log("bug in changeSliderLabel")}}function c(a,b){function c(a){switch(a){case"1":return.25;case"2":return.3333;case"3":return.5;default:console.log("bug in sizeSwitcher")}}var d=a.offsetWidth,e=document.getElementById("items").offsetWidth,f=d/e,g=c(b),h=(g-f)*e;return h}function d(a){var b=document.getElementsByClassName("contentItemOuter"),d=b[0],e=c(d,a);currentPizzaWidth=d.offsetWidth+e;for(var f=b.length,g=0;f>g;g++)b[g].style.backgroundSize=currentPizzaWidth+"px"}window.performance.mark("mark_start_resize"),b(a),rowCounter>0&&setTimeout(function(){d(a)},0),window.performance.mark("mark_end_resize"),window.performance.measure("measure_pizza_resize","mark_start_resize","mark_end_resize");var e=window.performance.getEntriesByName("measure_pizza_resize"),f="served up in "+e[0].duration+"ms !";document.getElementById("pizzaSizeTime").innerHTML=f,window.performance.clearMarks(),window.performance.clearMeasures()};