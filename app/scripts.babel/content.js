console.log('Mighty content js speaks to us... blaaa!');

const api = {
  card: {
    domRef: null,
    content: {}
  },
  handlers: {
    mouseOver: (e) => {
      let link = e.target.parentNode.href;
      let imdbId = link.match(/nm[0-9]*/g)[0];

      const position = {
        top: e.pageY - 200 - 15 + 'px',
        left: e.pageX + 'px'
      };

      api.showCard(position);

      api.getActorData(imdbId)
        .then((response) => {
          //populate card
          api.populateCard(response.data);
        });
    },
    mouseOut: () => {
      api.hideCard();
    }
  },
  createCard: () => {
    api.card.domRef = document.createElement('div');
    api.card.domRef.classList.add('helper-card');
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
  },
  showCard: (position) => {
    api.card.domRef.classList.add('show');
    api.card.domRef.style.top = position.top;
    api.card.domRef.style.left = position.left;
  },
  hideCard: () => {
    api.card.domRef.classList.remove('show');
    api.card.content.image.src = '';
  },
  _attachEventHandlers: () => {
    var actorsDomElements = document.querySelectorAll('.cast_list .itemprop a');

    const THROTTLE_TIME = 500;

    [].forEach.call(actorsDomElements, function(actor) {
      actor.addEventListener('mouseover', _.throttle(api.handlers.mouseOver, THROTTLE_TIME));
      actor.addEventListener('mouseout', _.throttle(api.handlers.mouseOut, THROTTLE_TIME));
    });
  },
  init: () => {
    api.createCard();
    api._attachEventHandlers();
  }
};

api.init();
