(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const body = document.body;
  const motion = document.getElementById('motion-control');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let preference = null;
  try { preference = sessionStorage.getItem('common-ground-motion'); } catch { /* Storage is optional. */ }
  let paused = preference === 'paused' || (preference !== 'playing' && reducedMotion.matches);
  let slideIndex = 0;
  let slideTimer;
  const images = [...document.querySelectorAll('.hero-image')];
  const dots = [...document.querySelectorAll('.slide-dot')];
  const captions = ['01 / Neighbours showing up', '02 / Care in the community', '03 / Good food, shared'];
  function showSlide(index) {
    slideIndex = index;
    images.forEach((image, i) => image.classList.toggle('active', i === index));
    dots.forEach((dot, i) => { dot.classList.toggle('selected', i === index); dot.setAttribute('aria-pressed', String(i === index)); });
    document.getElementById('hero-caption').textContent = captions[index];
  }
  function scheduleSlides() {
    clearInterval(slideTimer);
    if (!paused && !document.hidden) slideTimer = setInterval(() => showSlide((slideIndex + 1) % images.length), 6500);
  }
  function syncMotion() {
    body.classList.toggle('paused', paused);
    body.classList.toggle('motion-enabled', !paused);
    document.documentElement.style.scrollBehavior = paused ? 'auto' : '';
    motion.textContent = paused ? '▶ Play motion' : 'Ⅱ Pause motion';
    motion.setAttribute('aria-pressed', String(paused));
    scheduleSlides();
  }
  motion.addEventListener('click', () => {
    paused = !paused;
    try { sessionStorage.setItem('common-ground-motion', paused ? 'paused' : 'playing'); } catch { /* No persistence required. */ }
    syncMotion();
  });
  reducedMotion.addEventListener('change', event => { paused = event.matches; syncMotion(); });
  document.addEventListener('visibilitychange', scheduleSlides);
  dots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.slide)); scheduleSlides(); }));
  syncMotion();

  const menu = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('navigation');
  function closeMenu() { navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    reveals.forEach(element => observer.observe(element));
  } else reveals.forEach(element => element.classList.add('visible'));

  const rail = document.getElementById('story-rail');
  function moveStory(direction) { rail.scrollBy({ left: direction * (rail.firstElementChild.getBoundingClientRect().width + 22), behavior: paused ? 'instant' : 'smooth' }); }
  document.getElementById('story-prev').addEventListener('click', () => moveStory(-1));
  document.getElementById('story-next').addEventListener('click', () => moveStory(1));
  rail.addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); moveStory(event.key === 'ArrowRight' ? 1 : -1); } });

  const dialog = document.getElementById('detail-dialog');
  const title = document.getElementById('detail-title');
  const content = document.getElementById('detail-content');
  const programs = {
    food: { title: 'A seat at the table.', intro: 'A welcoming food program, built around choice and dignity.', items: ['Community pantry: choose the essentials that work for your household.', 'Shared kitchen: cook, learn, and enjoy a meal together.', 'Neighbour-to-neighbour delivery: a little extra help reaching the table.'] },
    garden: { title: 'Room to put down roots.', intro: 'A shared growing space where fresh food and friendships take root.', items: ['Open garden days: plant, water, and grow alongside your neighbours.', 'Seasonal workshops: learn the small skills that keep a garden thriving.', 'Shared harvest: bring fresh produce from the plot to the community table.'] },
    people: { title: 'A hand. A hello. A start.', intro: 'Sometimes the next step starts with someone listening.', items: ['A welcoming drop-in space to meet people and find your bearings.', 'Everyday essentials, shared with care and without judgement.', 'Friendly connections to community resources and practical support.'] }
  };
  let trigger;
  function openDialog(heading, html, source) { trigger = source; title.textContent = heading; content.innerHTML = html; dialog.showModal(); }
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close(); });
  dialog.addEventListener('close', () => trigger?.focus());
  document.querySelectorAll('[data-program]').forEach(button => button.addEventListener('click', () => {
    const program = programs[button.dataset.program];
    openDialog(program.title, `<p>${program.intro}</p><ul>${program.items.map(item => `<li>${item}</li>`).join('')}</ul><p>These programs illustrate the concept. For a real organisation, this space would include verified access information, opening hours, and a contact route.</p>`, button);
  }));
  document.getElementById('volunteer-open').addEventListener('click', event => {
    openDialog('Find your kind of good.', '<p>What would you love to help with?</p><div class="role-options"><button data-role="food" aria-pressed="false">01 / Food & community meals ↗</button><button data-role="garden" aria-pressed="false">02 / Gardening & outdoor days ↗</button><button data-role="welcome" aria-pressed="false">03 / Welcoming & neighbour support ↗</button></div><div id="volunteer-result" role="status" hidden></div>', event.currentTarget);
    const roles = { food: 'You could help pack pantry essentials or prepare a shared meal. A real signup would show available shifts and training details here.', garden: 'You could help plant, tend, or harvest in a shared garden. A real signup would show seasonal sessions and accessibility details here.', welcome: 'You could offer a warm welcome or help sort everyday essentials. A real signup would show the role description and next steps here.' };
    content.querySelectorAll('[data-role]').forEach(button => button.addEventListener('click', () => {
      content.querySelectorAll('[data-role]').forEach(option => { option.classList.toggle('selected', option === button); option.setAttribute('aria-pressed', String(option === button)); });
      const result = document.getElementById('volunteer-result'); result.hidden = false; result.textContent = roles[button.dataset.role] + ' This preview does not register you.';
    }));
  });

  let amount = 35;
  let frequency = 'monthly';
  const custom = document.getElementById('custom-amount');
  const result = document.getElementById('giving-result');
  function updateSummary() {
    result.hidden = true;
    document.getElementById('giving-summary').textContent = amount > 0 ? (frequency === 'monthly' ? `Your kindness, on repeat. $${amount.toLocaleString('en-CA')} CAD each month.` : `A little good, today. $${amount.toLocaleString('en-CA')} CAD, one time.`) : 'Choose a gift amount to preview.';
  }
  document.querySelectorAll('[data-frequency]').forEach(button => button.addEventListener('click', () => {
    frequency = button.dataset.frequency;
    document.querySelectorAll('[data-frequency]').forEach(option => { option.classList.toggle('selected', option === button); option.setAttribute('aria-pressed', String(option === button)); }); updateSummary();
  }));
  document.querySelectorAll('[data-amount]').forEach(button => button.addEventListener('click', () => {
    amount = Number(button.dataset.amount); custom.value = '';
    document.querySelectorAll('[data-amount]').forEach(option => { option.classList.toggle('selected', option === button); option.setAttribute('aria-pressed', String(option === button)); }); updateSummary();
  }));
  custom.addEventListener('input', () => { amount = custom.value ? Number(custom.value) : 0; document.querySelectorAll('[data-amount]').forEach(option => { option.classList.remove('selected'); option.setAttribute('aria-pressed', 'false'); }); updateSummary(); });
  document.getElementById('giving-form').addEventListener('submit', event => {
    event.preventDefault();
    result.hidden = false;
    result.textContent = amount >= 1 && amount <= 100000 && Number.isInteger(amount) ? `A little generosity looks good on you. Your preview: $${amount.toLocaleString('en-CA')} CAD ${frequency === 'monthly' ? 'per month' : 'as a one-time gift'}. This is a design demo. No donation was made and no payment details were collected.` : 'Please choose a whole-dollar amount between $1 and $100,000 CAD.';
  });
})();
