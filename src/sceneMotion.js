// Desktop uses a pinned scroll timeline. Mobile keeps the complete reading flow
// and adds touch-friendly reveals and lightweight portrait parallax.
export function mountSceneMotion() {
  const scenes = [...document.querySelectorAll('.scene')];
  const media = matchMedia('(min-width:701px) and (min-height:600px) and (prefers-reduced-motion:no-preference)');
  const mobileMedia = matchMedia('(max-width:700px) and (prefers-reduced-motion:no-preference)');
  const palette = ['#faf8f4', '#e2ebdc', '#dfeaf1', '#eedfd9', '#e4e7d7', '#faf8f4'];
  const root = document.documentElement;
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => { n = clamp(n); return n * n * (3 - 2 * n); };
  const rgb = hex => hex.match(/[a-f\d]{2}/gi).map(n => parseInt(n, 16));
  const colors = palette.map(rgb);
  let frame = 0, current = scrollY, target = current, last = 0, intervals = [], mobileObserver;
  const columns = scenes.map(s => [...s.querySelectorAll('.left,.right')]);
  const parts = columns.map(pair => pair.map(col => [...col.children]));
  const portraits = scenes.map(s => s.querySelector('.portrait'));
  // Visible alpha bounds in the supplied 800 x 1200 canvases.
  const bounds = {
    'person-front-cutout.png': [141,70,658,1130],
    'person-insight-cutout.png': [135,70,665,1130],
    'person-story-cutout.png': [40,143,760,1057],
    'person-learn-cutout.png': [168,70,632,1130],
    'person-grow-cutout.png': [144,70,655,1130],
    'person-real-cutout.png': [59,70,741,1130],
  };
  const clear = () => {
    document.body.classList.remove('cinematic');
    scenes.forEach(s => { s.inert = false; s.removeAttribute('aria-hidden'); s.style.removeProperty('height'); });
    parts.flat(2).forEach(part => {
      part.style.removeProperty('opacity');
      part.style.removeProperty('transform');
      part.style.removeProperty('clip-path');
    });
    root.style.removeProperty('--stage-color');
    current = target = scrollY;
  };
  const clearMobile = () => {
    mobileObserver?.disconnect(); mobileObserver = undefined;
    document.body.classList.remove('mobile-motion');
    root.style.removeProperty('--mobile-progress');
    scenes.forEach(scene => {
      scene.style.removeProperty('--mobile-person-shift');
      scene.style.removeProperty('--mobile-person-turn');
    });
    document.querySelectorAll('.is-revealed').forEach(el => el.classList.remove('is-revealed'));
  };
  const setupMobile = () => {
    clearMobile();
    if (!mobileMedia.matches) return;
    document.body.classList.add('mobile-motion');
    mobileObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          mobileObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .08 });
    [...parts.flat(2), ...portraits].forEach(el => mobileObserver.observe(el));
    paintMobile();
  };
  const paintMobile = () => {
    if (!mobileMedia.matches) return;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    root.style.setProperty('--mobile-progress', `${Math.min(1, scrollY / max)}`);
    scenes.forEach(scene => {
      const rect = scene.getBoundingClientRect();
      const centerDelta = (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
      scene.style.setProperty('--mobile-person-shift', `${Math.max(-18, Math.min(18, centerDelta * -12))}px`);
      const personRect = scene.querySelector('.portrait').getBoundingClientRect();
      const turn = Math.max(-16, Math.min(16, (personRect.top / innerHeight - .25) * 24));
      scene.style.setProperty('--mobile-person-turn', `${turn}deg`);
    });
  };
  function measure() {
    if (!media.matches) { clear(); return; }
    document.body.classList.add('cinematic');
    root.style.setProperty('--viewport-height', `${innerHeight}px`);
    portraits.forEach(portrait => {
      const filename = portrait.querySelector('img').getAttribute('src').split('/').pop();
      const [x0,y0,x1,y1] = bounds[filename] || [0,0,800,1200];
      // Fit wide poses inside their own third without distorting or cropping them.
      const scale = Math.min(innerHeight * 5 / 6 / (y1-y0),
        innerWidth / 3 * .94 / (x1-x0));
      portrait.style.setProperty('--image-width', `${800*scale}px`);
      portrait.style.setProperty('--image-height', `${1200*scale}px`);
    });
    const grid = scenes[0].querySelector('.grid');
    const style = getComputedStyle(grid);
    const available = grid.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    // Animated offsets affect scrollHeight. Measure the resting layout only.
    const elements = parts.flat(2);
    const transforms = elements.map(el => el.style.transform);
    elements.forEach(el => { el.style.transform = 'none'; });
    const overflows = columns.map(pair => pair.map(col => Math.max(0, col.scrollHeight - available)));
    elements.forEach((el,i) => { el.style.transform = transforms[i]; });
    // All chapters use one shared reading duration and the same viewport frame.
    const length = innerHeight * 2.2 + Math.max(0, ...overflows.flat());
    intervals = scenes.map((scene, i) => {
      scene.style.height = `${length}px`;
      return { start: i * length, length, overflow: overflows[i] };
    });
    schedule();
  }
  function paint(time) {
    frame = 0;
    if (!media.matches) return;
    const dt = Math.min(48, time - last || 16); last = time;
    current += (target - current) * (1 - Math.exp(-dt / 95));
    let active = 0;
    intervals.forEach((range, i) => { if (current >= range.start - innerHeight * .25) active = i; });
    const range = intervals[active];
    const transition = active === 0 ? 1 : ease((current - range.start + innerHeight * .25) / (innerHeight * .5));
    const prev = Math.max(0, active - 1);
    root.style.setProperty('--stage-color', `rgb(${colors[active].map((c,j) => Math.round(colors[prev][j] + (c-colors[prev][j])*transition)).join(',')})`);
    root.style.setProperty('--orbit-angle', `${current / innerHeight * 16}deg`);
    root.style.setProperty('--ambient-opacity', active === 5 ? 0 : .7);
    scenes.forEach((scene,i) => {
      const r = intervals[i];
      const enter = i === 0 ? 1 : ease((current-r.start+innerHeight*.25)/(innerHeight*.5));
      const exit = i === scenes.length-1 ? 0 : ease((current-r.start-r.length+innerHeight*.25)/(innerHeight*.5));
      const visible = enter > .001 && exit < .999;
      const enabled = i === active && (transition >= .5 || active === 0) || i === prev && transition < .5;
      scene.inert = !enabled;
      scene.setAttribute('aria-hidden', String(!enabled));
      scene.style.setProperty('--scene-visibility', visible ? 'visible' : 'hidden');
      // Swap only edge-on. Both halves rotate in the same direction, with no ghosting.
      const arriving = ease((enter-.5)*2);
      const departing = ease(exit*2);
      scene.style.setProperty('--person-opacity', enter >= .5 && exit < .5 ? 1 : 0);
      scene.style.setProperty('--person-turn', `${-90*(1-arriving)+90*departing}deg`);
      // Finish reading overflow before the next chapter starts moving in.
      const progressPan = clamp((current-r.start-innerHeight*.3)/Math.max(1,r.length-innerHeight*1.05));
      columns[i].forEach((col,side) => {
        col.style.setProperty('--column-pan', `${-progressPan * r.overflow[side]}px`);
        parts[i][side].forEach((part,j) => {
          const stagger = Math.min(j,5)*.018;
          const progress = ease((enter-stagger)/(1-stagger));
          const departure = exit;
          const opacity = Math.min(1,progress*4)*Math.min(1,(1-departure)*4);
          part.style.opacity = opacity;
          part.style.transform = `translate3d(0,${(1-progress)*innerHeight-departure*innerHeight}px,0)`;
          part.style.clipPath = 'none';
        });
      });
    });
    if (Math.abs(current-target) > .1) frame = requestAnimationFrame(paint);
  }
  function schedule() {
    target = scrollY;
    if (mobileMedia.matches) paintMobile();
    if(!frame) frame=requestAnimationFrame(paint);
  }
  const resize = new ResizeObserver(measure);
  columns.flat().forEach(col => resize.observe(col));
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',measure); media.addEventListener('change',measure);
  mobileMedia.addEventListener('change',setupMobile);
  measure(); setupMobile();
  return () => {
    cancelAnimationFrame(frame); resize.disconnect(); clear(); clearMobile();
    removeEventListener('scroll',schedule);removeEventListener('resize',measure);media.removeEventListener('change',measure);
    mobileMedia.removeEventListener('change',setupMobile);
    parts.flat(2).forEach(p => {p.style.removeProperty('opacity');p.style.removeProperty('transform');p.style.removeProperty('clip-path');});
  };
}
