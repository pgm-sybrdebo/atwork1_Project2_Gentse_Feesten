const headerImages = ['static/media/header1__img.jpg', 'static/media/header2__img.jpg', 'static/media/header3__img.jpg', 'static/media/header4__img.jpg', 'static/media/header5__img.jpg', 'static/media/header6__img.jpg', 'static/media/header7__img.jpg', 'static/media/header8__img.jpg', 'static/media/footer__img.jpg'];

(() => {
  const header = {
    initialize () {
      console.log('1. Application started');
      this.cacheElements();
      this.registerListeners();
      this.giveARandomHeaderImage();
    },
    cacheElements () {
      console.log('2. Cache all existing DOM elements!');
      this.$hamburger = document.querySelector('.button-hamb');
      this.$navOverlay = document.querySelector('.nav-overlay');
      this.$primlistLinkProgram = document.querySelector('.primlist__link--program');
      this.$secondlist = document.querySelector('.bar__secondlist');
      this.$upArrow = document.querySelector('.up-arrow');
      this.$closeButton = document.querySelector('.close__button');
      this.$headerTop = document.querySelector('.header__top');
    },
    registerListeners () {
      // This function will register the different event listeners
      // Event listener 1: listens if the hamburger menu is clicked
      this.$hamburger.addEventListener('click', (event) => {
        this.showNavig();
      });
      // Event listener 2: listens if program is clicked in the navbar
      this.$primlistLinkProgram.addEventListener('click', (event) => {
        this.showSecondList();
      });
      // Event listener 3: listens if the close button is clicked
      if (document.querySelector('.close__button') !== null) {
        this.$closeButton.addEventListener('click', (event) => {
          this.closeNavig();
        });
      }
    },
    showSecondList () {
      this.$secondlist.classList.toggle('bar__secondlist--open');
      this.$upArrow.classList.toggle('down-arrow');
    },
    showNavig () {
      this.$navOverlay.classList.toggle('nav-overlay--open');
    },
    closeNavig () {
      this.$navOverlay.classList.toggle('nav-overlay--open');
    },
    giveARandomHeaderImage () {
      this.$headerTop.style.backgroundImage = `url(${headerImages[Math.floor(Math.random() * headerImages.length)]})`;
    },
  };
  header.initialize();
})();
