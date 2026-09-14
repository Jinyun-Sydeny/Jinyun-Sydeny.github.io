// Text stays in normal document flow. Only the decorative portrait is fixed.
// This prevents expanded evidence from changing a pinned timeline or becoming inert.
export function mountSceneMotion() {
  const scenes = [...document.querySelectorAll('.scene')];
  const desktop = matchMedia('(min-width:1001px) and (min-height:600px) and (prefers-reduced-motion:no-preference)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const bounds = {
    'person-front-cutout.png': [141,70,658,1130],
    'person-insight-cutout.png': [135,70,665,1130],
    'person-story-cutout.png': [40,143,760,1057],
    'person-learn-cutout.png': [168,70,632,1130],
    'person-grow-cutout.png': [144,70,655,1130],
    'person-real-cutout.png': [59,70,741,1130],
  };
  const stage = document.createElement('div');
  stage.className = 'character-stage';
  stage.setAttribute('aria-hidden', 'true');
  const portraits = scenes.map(scene => {
    const portrait = scene.querySelector('.portrait').cloneNode(true);
    stage.append(portrait);
    return portrait;
  });
  document.body.append(stage);
  let frame = 0, observer;
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => {n=clamp(n); return n*n*(3-2*n);};
  function paint() {
    frame = 0;
    document.documentElement.style.setProperty('--reading-progress', clamp(scrollY / Math.max(1, document.documentElement.scrollHeight-innerHeight)));
    if (!desktop.matches) return;
    // Measure real section positions each frame, including open details and images.
    const tops = scenes.map(scene => scene.getBoundingClientRect().top);
    let active = 0;
    tops.forEach((top, index) => {if (top <= innerHeight*.72) active=index;});
    const transition = active === 0 ? 1 : ease((innerHeight*.72-tops[active])/(innerHeight*.44));
    portraits.forEach((portrait, index) => {
      const previous = index === active-1 && transition < .5;
      const arriving = index === active && transition >= .5;
      portrait.style.opacity = previous || arriving ? '1' : '0';
      const turn = previous ? 90*ease(transition*2) : -90*(1-ease((transition-.5)*2));
      portrait.style.transform = `translate(-50%,-50%) perspective(1600px) rotateY(${turn}deg)`;
    });
    // The directory is an intentional full-width pause between introduction and cases.
    const directory = document.querySelector('.project-directory').getBoundingClientRect();
    stage.style.visibility = directory.top < innerHeight*.5 && directory.bottom > innerHeight*.5 ? 'hidden' : 'visible';
  }
  function schedule() {if (!frame) frame=requestAnimationFrame(paint);}
  function setup() {
    document.body.classList.toggle('portrait-motion', desktop.matches);
    document.body.classList.toggle('reading-motion', !reduced.matches);
    observer?.disconnect();
    const parts = document.querySelectorAll('.scene:not(.intro) .left > *, .scene:not(.intro) .right > *');
    parts.forEach(part => part.classList.remove('reveal-pending'));
    if (!reduced.matches) {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      }), {threshold:0, rootMargin:'0px 0px -25px 0px'});
      parts.forEach(part => {
        if (part.getBoundingClientRect().top > innerHeight) {
          part.classList.add('reveal-pending');
          observer.observe(part);
        }
      });
    }
    portraits.forEach(portrait => {
      const file = portrait.querySelector('img').getAttribute('src').split('/').pop();
      const [x0,y0,x1,y1] = bounds[file];
      const scale = Math.min(innerHeight*5/6/(y1-y0), innerWidth/3*.94/(x1-x0));
      portrait.style.width = `${800*scale}px`;
      portrait.style.height = `${1200*scale}px`;
    });
    schedule();
  }
  // Native keyboard focus must never land on an unrevealed piece of content.
  function revealFocused(event) {
    const hidden = event.target.closest('.reveal-pending');
    hidden?.classList.remove('reveal-pending');
  }
  const resize = new ResizeObserver(schedule);
  scenes.forEach(scene => resize.observe(scene));
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', setup);
  document.addEventListener('focusin', revealFocused);
  desktop.addEventListener('change', setup);
  reduced.addEventListener('change', setup);
  setup();
  return () => {
    cancelAnimationFrame(frame); observer?.disconnect(); resize.disconnect(); stage.remove();
    document.body.classList.remove('portrait-motion', 'reading-motion');
    document.querySelectorAll('.reveal-pending').forEach(part => part.classList.remove('reveal-pending'));
    document.documentElement.style.removeProperty('--reading-progress');
    removeEventListener('scroll', schedule); removeEventListener('resize', setup);
    document.removeEventListener('focusin', revealFocused);
    desktop.removeEventListener('change', setup); reduced.removeEventListener('change', setup);
  };
}
