
const EVENTS_API = 'https://www.pgm.gent/data/gentsefeesten/events.json';

const CATEGORIES_API = 'https://www.pgm.gent/data/gentsefeesten/categories.json';

const placeholdersThumb = ['./static/media/placeholder_thumb_1.PNG', './static/media/placeholder_thumb_2.JPEG', './static/media/placeholder_thumb_3.JPEG', './static/media/placeholder_thumb_4.JPEG', './static/media/placeholder_thumb_5.JPEG'];

const placeholdersFull = ['./static/media/placeholder_full_1.png', './static/media/placeholder_full_2.jpg', './static/media/placeholder_full_3.jpg', './static/media/placeholder_full_4.jpg', './static/media/placeholder_full_5.jpg'];

(() => {
  const app = {
    initialize () {
      this.cacheElements();
      this.getDataFromCategoriesAPIEndpoint();
      this.checkActiveDay();
      this.registerListeners();
    },
    cacheElements () {
      this.$popularEvents = document.querySelector('.popular-events');
      this.$highlights = document.querySelector('.highlights');
      this.$categories = document.querySelector('.categories');
      this.$events = document.querySelector('.events');
      this.$daysMenu = document.querySelectorAll('.link__date');
      this.$daysMenuLinks = document.querySelectorAll('.days-menu__link');
      this.$buttonListView = document.getElementById('button__listview');
      this.$buttonGridView = document.getElementById('button__gridview');
      this.$listButton = document.getElementById('list__button');
      this.$gridButton = document.getElementById('grid__button');
      this.$eventDetail = document.querySelector('.event-detail');
    },
    registerListeners () {
      // This function will register the different event listeners
      if (document.getElementById('button__listview') !== null) {
        // Event listener 1: listens if the list button is clicked
        this.$buttonListView.addEventListener('click', (event) => {
          if (!this.$buttonListView.classList.contains('list__button--active')) {
            this.changeToListView();
          }
        });
        // Event listener 2: listens if the grid button is clicked
        this.$buttonGridView.addEventListener('click', (event) => {
          if (!this.$buttonGridView.classList.contains('list__button--active')) {
            this.changeToListView();
          }
        });
      }
    },
    changeToListView () {
      document.querySelectorAll('.link__top').forEach(event => event.classList.toggle('link__top--list'));
      document.querySelectorAll('.events__item').forEach(event => event.classList.toggle('events__item--list'));
      document.querySelectorAll('.link__bottom').forEach(event => event.classList.toggle('link__bottom--list'));
      document.querySelectorAll('.bottom__date').forEach(event => event.classList.toggle('bottom__date--list'));
      document.querySelectorAll('.date__time').forEach(event => event.classList.toggle('date__time--list'));
      document.querySelectorAll('.bottom__title').forEach(event => event.classList.toggle('bottom__title--list'));
      document.querySelectorAll('.bottom__location').forEach(event => event.classList.toggle('bottom__location--list'));
      this.$buttonGridView.classList.toggle('list__button--active');
      this.$buttonListView.classList.toggle('list__button--active');
      this.$gridButton.classList.toggle('layout-button--active');
      this.$listButton.classList.toggle('layout-button--active');
    },
    getDataFromCategoriesAPIEndpoint () {
      fetch(CATEGORIES_API, {})
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          throw new Error('something went wrong !');
        })
        .then((json) => {
          this.categories = json;
          this.getDataFromEventsAPIEndpoint();
        })
        .catch(error => console.error(error));
    },
    getDataFromEventsAPIEndpoint () {
      fetch(EVENTS_API, {})
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          throw new Error('something went wrong !');
        })
        .then((json) => {
          this.events = json;
          if (this.$popularEvents !== null) {
            this.updatePopularEventsUI(json);
          } if (this.$highlights !== null) {
            this.updateHighlightsUI(json);
            this.updateCategoriesUI(this.categories);
            this.getHTMLForAllEventsDay();
          } if (this.$eventDetail !== null) {
            this.getHTMLForEventDetail();
          }
        })
        .catch(error => console.error(error));
    },
    changeTime (time) {
      const newTime = time.replace(':', '.');
      return newTime;
    },
    ChangeDay (day) {
      const shortDay = day.slice(0, 2);
      return shortDay;
    },
    checkActiveDay () {
      const activeDay = this.URLSearchParamsDay();
      for (let i = 0; i < this.$daysMenu.length; i++) {
        const day = this.$daysMenu[i].innerHTML;
        const dayNumber = day.slice(0, 2);
        if (dayNumber === activeDay) {
          this.$daysMenu[i].parentNode.classList.toggle('days-menu__link--active');
        }
      }
    },
    updatePopularEventsUI (data) {
      let tempStr = '<ul class="popular-events__list">';
      const n = 3;
      for (let i = 0; i < n; i++) {
        const randomItem = data[Math.floor(Math.random() * data.length)];
        tempStr += `
        <li class="popular-events__item">
                <a class="event-item__link" href="detail.html?day=${randomItem.day}&slug=${randomItem.slug}">
                    <div class="link__top">
                        <div class="top__img">
                            <img class="top__img__img" src="${randomItem.image == null ? placeholdersThumb[Math.floor(Math.random() * placeholdersThumb.length)] : randomItem.image.thumb}" alt="${randomItem.title}">
                        </div>
                    </div>
                    <div class="link__bottom">
                        <span class="bottom__date"><span class="date__date">${this.ChangeDay(randomItem.day_of_week)} ${randomItem.day} Jul</span> <span class="date__time">${this.changeTime(randomItem.start)} u.</span></span>
                        <h3 class="bottom__title">${randomItem.title}</h3>
                        <span class="bottom__location">${randomItem.location}</span>
                    </div>
                </a>
            </li>
        `;
      }
      tempStr += '</ul>';
      this.$popularEvents.innerHTML = tempStr;
    },
    URLSearchParamsDay () {
      const { search } = window.location;
      const params = new URLSearchParams(search);
      const urlType = params.get('day');
      return urlType;
    },
    URLSearchParamsSlug () {
      const { search } = window.location;
      const params = new URLSearchParams(search);
      const urlType = params.get('slug');
      return urlType;
    },
    getDayData (data) {
      const day = this.URLSearchParamsDay();
      const dayData = [];
      data.map((item) => {
        if (item.day === day) {
          dayData.push(item);
        }
      });
      return dayData;
    },
    updateHighlightsUI (data) {
      const dayData = this.getDayData(data);
      let tempStr = '<ul class= "highlights__list">';
      const n = 3;
      for (let i = 0; i < n; i++) {
        const randomItem = dayData[Math.floor(Math.random() * dayData.length)];
        tempStr += `
        <li class="highlights__item">
                <a class="highlights-item__link" href="detail.html?day=${randomItem.day}&slug=${randomItem.slug}">
                    <div class="link__top-highlight">
                        <div class="top-highlight__img">
                            <img class="top-highlight__img__img" src="${randomItem.image == null ? placeholdersThumb[Math.floor(Math.random() * placeholdersThumb.length)] : randomItem.image.thumb}" alt="${randomItem.title}">
                        </div>
                    </div>
                    <div class="link__bottom-highlight">
                        <span class="bottom-highlight__date"><span class="date__time-highlight">${this.changeTime(randomItem.start)} u.</span></span>
                        <h3 class="bottom__title-highlight">${randomItem.title}</h3>
                        <span class="bottom__location-highlight">${randomItem.location}</span>
                    </div>
                </a>
            </li>
        `;
      }
      tempStr += '</ul>';
      this.$highlights.innerHTML = tempStr;
    },
    updateCategoriesUI (data) {
      this.$categories.innerHTML = data.map(category => `
          <li class="category__item"><a class="category__link" href="#category${data.indexOf(category)}">${category}</a></li>
          `).join('');
    },
    getHTMLForAllEventsDay () {
      const allEventsDay = this.categories.map((category) => {
        const eventsDay = this.getDayData(this.events).filter(event => event.category.indexOf(category) > -1);
        eventsDay.sort((firstEvent, secondEvent) => firstEvent.sort_key.localeCompare(secondEvent.sort_key));
        const categoryEvents = eventsDay.map(event => `
          <li class="events__item">
                <a class="event-item__link" href="detail.html?day=${event.day}&slug=${event.slug}">
                    <div class="link__top">
                        <div class="top__img">
                            <img class="top__img__img" src="${event.image == null ? placeholdersThumb[Math.floor(Math.random() * placeholdersThumb.length)] : event.image.thumb}" alt="${event.title}">
                        </div>
                    </div>
                    <div class="link__bottom">
                        <span class="bottom__date"><span class="date__time">${this.changeTime(event.start)} u.</span></span>
                        <h3 class="bottom__title">${event.title}</h3>
                        <span class="bottom__location">${event.location}</span>
                    </div>
                </a>
            </li>
          `).join('');
        return `
        <section id="category${this.categories.indexOf(category)}">
          <div class="category__heading">
            <h2 class="category__title">${category}</h2>
            <a href="#category-1"><svg class="arrow-up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M13.682 11.791l-6.617 6.296L4 15.171 15.74 4 28 15.665l-2.935 2.793-7.113-6.768v16.311h-4.269z"/></svg></a>
          </div>
          <ul class= "list__events">
            ${categoryEvents}
          </ul>
        </section>
      `;
      }).join('');
      this.$events.innerHTML = allEventsDay;
    },
    getHTMLForEventDetail () {
      if (document.querySelector('.event-detail') !== null) {
        const slug = this.URLSearchParamsSlug();
        let eventsDay = this.getDayData(this.events).filter((event) => {
          if (slug === event.slug) {
            return event;
          }
        });
        eventsDay = eventsDay.slice(0, 1);
        const detailEvent = eventsDay.map(event => `
          <div class="event-detail__heading">
                <h1 class="event-detail__title">${event.title}</h1>
                <a class="event-detail__location" href="#">
                    <svg class="location__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16.5 10.568a4 4 0 000 8 4 4 0 000-8m0 3c.551 0 1 .45 1 1s-.449 1-1 1-1-.449-1-1c0-.55.449-1 1-1M16.5 3C10.149 3 5 8.15 5 14.5c0 8.363 11.5 14.636 11.5 14.636S28 22.863 28 14.5C28 8.15 22.851 3 16.5 3m0 3c4.687 0 8.5 3.813 8.5 8.5 0 4.592-5.253 9.003-8.5 11.131-3.249-2.13-8.5-6.54-8.5-11.13C8 9.812 11.813 6 16.5 6"/></svg>
                    <span class="location__text">${event.location}</span>
                </a>
                <span class="event-detail__time">${event.day_of_week} ${event.day} juli - ${this.changeTime(event.start)} u. > ${this.changeTime(event.end)} u.</span>
            </div>
            <div class="event-detail__container">
                <div class="event-detail__left">
                    <img class="event-detail__img" src="${event.image == null ? placeholdersFull[Math.floor(Math.random() * placeholdersFull.length)] : event.image.full}" alt="${event.title}">
                </div>
                <div class="event-detail__right">
                    ${event.description === undefined ? '' : `<p class="event-detail__description">${event.description}</p>`}
                    <ul class="event-detail__list">
                        ${event.url === null ? '' : `<li class="list__detail-item">
                        <span class="detail-item__topic">Website:</span>
                        <a class="detail-item__link" href="${event.url}" target="_blank">${event.url}<svg class="external-link" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M21.061 9.44a1.498 1.498 0 00-2.59 1.03c0 .429.18.816.468 1.089l.001.001L22.379 15H9c-3.308 0-6 2.692-6 6s2.692 6 6 6h2.5a1.5 1.5 0 000-3H9c-1.654 0-3-1.346-3-3s1.346-3 3-3h13.379l-3.439 3.44a1.5 1.5 0 102.12 2.121l.001-.001 7.061-7.06-7.061-7.06z"/></svg></a>
                    </li>`}
                        <li class="list__detail-item">
                            <span class="detail-item__topic detail-item__topic--organisator">Organisator:</span>
                            <a class="detail-item__link" href="#">${event.organizer}</a>
                        </li>
                        <li class="list__detail-item">
                            <span class="detail-item__topic detail-item__topic--category">Categorieën:</span>
                            <ul class="detail-item__sublist">
                                ${event.category.map(cat => `
                                  <li><a class="detail-item__link" href="#">${cat}</a></li>
                                  `).join('')}
                            </ul>
                        </li>
                        ${event.wheelchair_accessible ? '<li class="list__detail-item"><svg class="wheelchair__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M12.646 15.008l.47 2.993-.115-.001a4.5 4.5 0 104.071 2.58l.012.027 3.332.766a7.5 7.5 0 11-10.781-5.579l.043-.02-.813-2.274H7a1 1 0 010-2h2.57c.431.001.798.274.938.656l.002.007 1.064 2.972c.35-.067.707-.11 1.072-.127zm.496-6.526a3.5 3.5 0 111.985-.382l-.019.009.722 4.606c.087-.015.177-.018.269-.01l6 .597a1 1 0 11-.203 1.989h.005l-5.757-.572.338 2.157 6.392 1.468c.375.088.665.379.751.747l.001.007 1.855 8.182 2.277-.567a1 1 0 01.491 1.939l-.007.002-3.268.815a1 1 0 01-1.216-.742l-.001-.007-1.943-8.566-6.439-1.48a1.002 1.002 0 01-.763-.813l-.001-.006-1.47-9.374zM13.5 6.5a1.5 1.5 0 000-3 1.5 1.5 0 000 3zm-.5 18a2 2 0 110-4 2 2 0 110 4z"/></svg></li>' : ''}
                    </ul>
                    <ul class="event-detail__social-list">
                        <li class="social-list__item"><a class="social-list__link" href="#"><svg class="social-list__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M12.973 24c7.17 0 11.093-5.77 11.093-10.773 0-.164-.003-.328-.013-.49a7.865 7.865 0 001.93-1.935l.017-.025a7.759 7.759 0 01-2.202.591l-.038.004a3.842 3.842 0 001.706-2.068l.008-.027a7.785 7.785 0 01-2.427.912l-.05.008c-1.473-1.526-3.942-1.603-5.512-.172a3.733 3.733 0 00-1.232 2.761v.001c0 .29.035.58.103.863-3.134-.153-6.055-1.59-8.036-3.956-1.032 1.73-.504 3.942 1.208 5.054a3.947 3.947 0 01-1.787-.483l.021.01v.048c0 1.802 1.307 3.355 3.125 3.712a3.915 3.915 0 01-1.027.133 4.11 4.11 0 01-.758-.071l.025.004c.512 1.541 1.975 2.598 3.642 2.63a7.907 7.907 0 01-4.814 1.62h-.027.001c-.31 0-.62-.017-.929-.053A11.147 11.147 0 0012.953 24h.022-.001"/></svg></a></li>
                        <li class="social-list__item"><a class="social-list__link" href="#"><svg class="social-list__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M17.49 25v-8.21h2.95l.44-3.2h-3.39v-2.043c0-.927.276-1.558 1.697-1.558L21 9.988V7.126A25.196 25.196 0 0018.445 7h-.091.005c-2.614 0-4.403 1.491-4.403 4.23v2.36H11v3.2h2.956V25h3.535z"/></svg></a></li>
                        <li class="social-list__item"><a class="social-list__link" href="#"><svg class="social-list__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M8.625 13.486c0 1.396.614 3.464 2.234 3.911.057 0 .112.057.224.057.392 0 .615-1.006.615-1.286 0-.335-.895-1.062-.895-2.402 0-2.906 2.347-4.917 5.42-4.917 2.627 0 4.582 1.397 4.582 3.911 0 1.9-.838 5.475-3.464 5.475-.95 0-1.788-.67-1.788-1.563 0-1.341 1.006-2.682 1.006-4.079 0-.838-.503-1.564-1.509-1.564-1.341 0-2.124 1.396-2.124 2.458 0 .614.057 1.285.392 1.844-.559 2.124-1.62 5.308-1.62 7.487 0 .671.111 1.341.167 2.012v.112l.168-.056c1.956-2.459 1.844-2.962 2.738-6.203.447.838 1.676 1.285 2.682 1.285 4.079 0 5.923-3.688 5.923-7.04 0-3.52-3.297-5.867-6.929-5.867-3.911-.001-7.822 2.458-7.822 6.425z"/></svg></a></li>
                    </ul>
                </div>
            </div>
          `);
        this.$eventDetail.innerHTML = detailEvent;
      }
    },
  };
  app.initialize();
})();
