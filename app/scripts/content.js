'use strict';

console.log('Mighty content js speaks to us... blaaa!');

var spinner = {
  domRef: null,
  init: function init(parent) {
    spinner.domRef = document.createElement('div');
    spinner.domRef.classList.add('custom-spinner');

    var item1 = document.createElement('div');
    item1.classList.add('double-bounce1');
    spinner.domRef.appendChild(item1);

    var item2 = document.createElement('div');
    item2.classList.add('double-bounce2');
    spinner.domRef.appendChild(item2);

    parent.appendChild(spinner.domRef);
  }
};

var api = {
  card: {
    domRef: null,
    content: {}
  },
  handlers: {
    helpers: {
      tdebouncedMouseOver: null
    },
    mouseOver: function mouseOver(e) {
      var link = e.target.parentNode.href;
      var imdbId = link.match(/nm[0-9]*/g)[0];

      var position = {
        top: e.pageY - 220 - 15 + 'px',
        left: e.pageX + 'px'
      };

      api.clearCard();
      api.showCard(position);

      api.getActorData(imdbId).then(function (response) {
        //populate card
        api.populateCard(response.data);
      });
    },
    mouseOut: function mouseOut() {
      api.handlers.helpers.tdebouncedMouseOver.cancel();
      api.hideCard();
    }
  },
  createCard: function createCard() {
    api.card.domRef = document.createElement('div');
    api.card.domRef.classList.add('helper-card');
    api.card.domRef.classList.add('is-loading');
    api.card.content.image = document.createElement('img');
    api.card.domRef.appendChild(api.card.content.image);
    document.querySelector('body').appendChild(api.card.domRef);
  },
  getActorData: function getActorData(imdbId) {
    var url = 'http://imdb.wemakesites.net/api/' + imdbId;

    return fetch(url, { method: 'GET' }).then(function (response) {
      return response.json();
    });
  },
  populateCard: function populateCard(actorInfo) {
    api.card.content.image.src = actorInfo.image;
    api.card.domRef.classList.remove('is-loading');
  },
  showCard: function showCard(position) {
    api.card.domRef.classList.add('show');
    api.card.domRef.style.top = position.top;
    api.card.domRef.style.left = position.left;
  },
  clearCard: function clearCard() {
    api.card.domRef.classList.add('is-loading');
  },
  hideCard: function hideCard() {
    api.card.domRef.classList.remove('show');
    api.clearCard();
  },
  _attachEventHandlers: function _attachEventHandlers() {
    var actorsDomElements = document.querySelectorAll('.cast_list .itemprop a');

    var THROTTLE_TIME = 500;

    api.handlers.helpers.tdebouncedMouseOver = _.debounce(api.handlers.mouseOver, THROTTLE_TIME);

    [].forEach.call(actorsDomElements, function (actor) {
      actor.addEventListener('mouseover', api.handlers.helpers.tdebouncedMouseOver);
      actor.addEventListener('mouseout', api.handlers.mouseOut);
    });
  },
  init: function init() {
    api.createCard();
    spinner.init(api.card.domRef);
    api._attachEventHandlers();
  }
};

api.init();
//# sourceMappingURL=content.js.map
