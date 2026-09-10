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
  const clear = () => {
    document.body.classList.remove('cinematic');
    scenes.forEach(s => { s.inert = false; s.removeAttribute('aria-hidden'); s.style.removeProperty('height'); });
    parts.flat(2).forEach(part => {
      part.style.removeProperty('opacity');
      part.style.removeProperty('transform');
      part.style.removeProperty('clip-path');
    });
    root.style.removeProperty('--stage-color');
  };
  const clearMobile = () => {
    mobileObserver?.disconnect(); mobileObserver = undefined;
    document.body.classList.remove('mobile-motion');
    root.style.removeProperty('--mobile-progress');
    scenes.forEach(scene => {
      scene.classList.remove('is-visible');
      scene.style.removeProperty('--mobile-person-shift');
    });
  };
  const setupMobile = () => {
    clearMobile();
    if (!mobileMedia.matches) return;
    document.body.classList.add('mobile-motion');
    mobileObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .08 });
    scenes.forEach(scene => mobileObserver.observe(scene));
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
    });
  };
  function measure() {
    if (!media.matches) { clear(); return; }
    document.body.classList.add('cinematic');
    const grid = scenes[0].querySelector('.grid');
    const style = getComputedStyle(grid);
    const available = grid.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    const overflows = columns.map(pair => pair.map(col => Math.max(0, col.scrollHeight - available)));
    // All chapters use one shared reading duration and the same viewport frame.
    const length = innerHeight * 1.6 + Math.max(0, ...overflows.flat());
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
      scene.style.setProperty('--person-opacity', Math.min(enter, 1-exit));
      scene.style.setProperty('--person-scale', .96 + .04 * Math.min(enter,1-exit));
      const progressPan = clamp((current-r.start-innerHeight*.3)/Math.max(1,r.length-innerHeight*.9));
      columns[i].forEach((col,side) => {
        col.style.setProperty('--column-pan', `${-progressPan * r.overflow[side]}px`);
        parts[i][side].forEach((part,j) => {
          const stagger = Math.min(j,5)*.035;
          const progress = ease((enter-.42-stagger)/(.58-stagger));
          const departure = ease(exit/.58);
          const opacity = progress * (1-departure);
          part.style.opacity = opacity;
          part.style.transform = `translate3d(${(side?1:-1)*departure*44}px,${(1-progress)*48-departure*30}px,0)`;
          part.style.clipPath = `inset(0 0 ${(1-progress)*100}% 0)`;
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
