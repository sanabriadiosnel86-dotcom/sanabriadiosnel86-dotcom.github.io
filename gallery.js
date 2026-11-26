const dialog = document.querySelector('#viewer');
const image = document.querySelector('#viewer-image');
const caption = document.querySelector('#viewer-caption');
const count = document.querySelector('#viewer-count');
let group = [];
let index = 0;
let opener = null;

function showImage() {
  const link = group[index];
  image.src = link.href;
  image.alt = link.dataset.label;
  caption.textContent = link.dataset.label;
  count.textContent = `${index + 1} de ${group.length}`;
}

function move(offset) {
  index = (index + offset + group.length) % group.length;
  showImage();
}

const links = [...document.querySelectorAll('[data-gallery]')];
for (const link of links) {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.showModal) return;
    event.preventDefault();
    group = links.filter((item) => item.dataset.gallery === link.dataset.gallery);
    index = group.indexOf(link);
    opener = link;
    showImage();
    dialog.showModal();
    document.querySelector('#close-viewer').focus();
  });
}
document.querySelector('#previous').addEventListener('click', () => move(-1));
document.querySelector('#next').addEventListener('click', () => move(1));
document.querySelector('#close-viewer').addEventListener('click', () => dialog.close());
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') move(-1);
  if (event.key === 'ArrowRight') move(1);
});
dialog.addEventListener('close', () => opener?.focus());

const area = document.querySelector('#adoption-area');
const areaStatus = document.querySelector('#adoption-status');
const pets = [...document.querySelectorAll('.sample-pet')];

function filterPets() {
  const selected = area.value;
  let visible = 0;
  for (const pet of pets) {
    pet.hidden = selected !== '' && pet.dataset.area !== selected;
    if (!pet.hidden) visible += 1;
  }
  const location = selected ? ` en ${selected}` : '';
  areaStatus.textContent = visible === 0
    ? `Todavía no hay perfiles de muestra${location}.`
    : `${visible} ${visible === 1 ? 'perfil ficticio' : 'perfiles ficticios'}${location} en la demo.`;
}
area.addEventListener('change', filterPets);
filterPets();
