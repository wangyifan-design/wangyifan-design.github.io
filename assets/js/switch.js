
document.querySelectorAll('.container').forEach(container => {
  const images = container.dataset.images.split(',');
  const imgElement = container.querySelector('img');
  const button = container.querySelector('button');
  let currentIndex = 0;

  button.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      imgElement.src = images[currentIndex];
      imgElement.alt = `p ${currentIndex + 1}`;
  });
});