console.log('Mighty content js speaks to us... blaaa!');

const spinner = {
  domRef: null,
  init: (parent) => {
    spinner.domRef = document.createElement('div');
    spinner.domRef.classList.add('custom-spinner');

    let item1 = document.createElement('div');
    item1.classList.add('double-bounce1');
    spinner.domRef.appendChild(item1);

    let item2 = document.createElement('div');
    item2.classList.add('double-bounce2');
    spinner.domRef.appendChild(item2);

    parent.appendChild(spinner.domRef);
  }
};

const api = {
  card: {
    domRef: null,
    content: {}
  },
  handlers: {
    helpers: {
      tdebouncedMouseOver: null
    },
    mouseOver: (e) => {
      let link = e.target.parentNode.href;
      let imdbId = link.match(/nm[0-9]*/g)[0];

      const position = {
        top: e.pageY - 220 - 15 + 'px',
        left: e.pageX + 'px'
      };

      api.clearCard();
      api.showCard(position);

      api.getActorData(imdbId)
        .then((response) => {
          //populate card
          api.populateCard(response.data);
        });
    },
    mouseOut: () => {
      api.handlers.helpers.tdebouncedMouseOver.cancel();
      api.hideCard();
    }
  },
  createCard: () => {
    api.card.domRef = document.createElement('div');
    api.card.domRef.classList.add('helper-card');
    api.card.domRef.classList.add('is-loading');
    api.card.content.image = document.createElement('img');
    api.card.domRef.appendChild(api.card.content.image);
    document.querySelector('body').appendChild(api.card.domRef);
  },
  getActorData: (imdbId) => {
    var url = `http://imdb.wemakesites.net/api/${imdbId}`;

    return fetch(url, { method: 'GET' })
      .then((response) => {
        return response.json();
      });
  },
  populateCard: (actorInfo) => {
    api.card.content.image.src = actorInfo.image;
    api.card.domRef.classList.remove('is-loading');
  },
  showCard: (position) => {
    api.card.domRef.classList.add('show');
    api.card.domRef.style.top = position.top;
    api.card.domRef.style.left = position.left;
  },
  clearCard: () => {
    api.card.domRef.classList.add('is-loading');
  },
  hideCard: () => {
    api.card.domRef.classList.remove('show');
    api.clearCard();
  },
  _attachEventHandlers: () => {
    var actorsDomElements = document.querySelectorAll('.cast_list .itemprop a');

    const THROTTLE_TIME = 500;

    api.handlers.helpers.tdebouncedMouseOver = _.debounce(api.handlers.mouseOver, THROTTLE_TIME);

    [].forEach.call(actorsDomElements, function(actor) {
      actor.addEventListener('mouseover', api.handlers.helpers.tdebouncedMouseOver);
      actor.addEventListener('mouseout', api.handlers.mouseOut);
    });
  },
  init: () => {
    api.createCard();
    spinner.init(api.card.domRef);
    api._attachEventHandlers();
  }
};



api.init();
