const NEWS_API = 'https://www.pgm.gent/data/gentsefeesten/news.json';

(() => {
  const news = {
    initialize () {
      console.log('1. Application started');
      this.cacheElements();
      this.getDataFromNewsAPIEndpoint();
    },
    cacheElements () {
      console.log('2. Cache all existing DOM elements!');
      this.$news = document.querySelector('.news');
    },
    getDataFromNewsAPIEndpoint () {
      fetch(NEWS_API, {})
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          throw new Error('something went wrong !');
        })
        .then((json) => {
          this.news = json;
          this.updateNewsUI(json);
        })
        .catch(error => console.error(error));
    },
    changeTimeString (date) {
      const time = new Date(date).toISOString();
      const newTime = `${time.slice(5, 7)}/${time.slice(8, 10)}`;
      return newTime;
    },
    updateNewsUI (data) {
      let tempStr = '<ul class="news__list">';
      const n = 3;
      for (let i = 0; i < n; i++) {
        const randomItem = data[Math.floor(Math.random() * data.length)];
        tempStr += `
        <li class="news__item">
                    <a class="item__link" href="index.html">
                        <div class="link__left">
                            <div class="left__img">
                                <img class="img__img" src="${randomItem.picture.medium}"></img>
                            </div>
                            <span class="left__date">${this.changeTimeString(randomItem.publishedAt)}</span>
                        </div>
                        <div class="link__right">
                            <h3 class="right__title">${randomItem.title}</h3>
                            <p>${randomItem.synopsis}</p>
                            <svg class="right__arrow" width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.683 0L6.785 1.885l4.118 4.118H0v2.661h10.903l-4.118 4.117 1.898 1.886L16 7.333 8.683 0z" fill="#000"/></svg>
                        </div>
                    </a>
                </li>
        `;
      }
      tempStr += ' <a class="news__button" href="index.html">Bekijk alle nieuwsberichten</a></ul>';
      this.$news.innerHTML = tempStr;
    },
  };
  news.initialize();
})();
