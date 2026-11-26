for (const project of document.querySelectorAll('[data-project-tabs]')) {
  const list = project.querySelector('[data-tab-list]');
  const tabs = [...list.querySelectorAll('[data-tab]')];
  const panels = tabs.map((tab) => project.querySelector(`[data-panel="${tab.dataset.tab}"]`));
  const projectTitle = project.closest('article').querySelector('h4');

  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', projectTitle.textContent.trim());

  for (const [index, tab] of tabs.entries()) {
    const panel = panels[index];
    tab.id = `${panel.id}-tab`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
  }

  function activate(selected) {
    for (const [index, tab] of tabs.entries()) {
      const active = index === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[index].hidden = !active;
    }
  }

  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener('click', () => activate(index));
  }

  list.addEventListener('keydown', (event) => {
    const current = tabs.indexOf(event.target);
    const last = tabs.length - 1;
    const destinations = {
      ArrowLeft: current > 0 ? current - 1 : last,
      ArrowRight: current < last ? current + 1 : 0,
      Home: 0,
      End: last,
    };
    if (current === -1 || !Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    const next = destinations[event.key];
    activate(next);
    tabs[next].focus();
  });

  activate(0);
  list.hidden = false;
}
