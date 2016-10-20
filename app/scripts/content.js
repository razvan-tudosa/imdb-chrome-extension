'use strict';

console.log('Mighty content js speaks to us... blaaa!');

var api = {
  card: {
    domRef: null,
    content: {}
  },
  handlers: {
    mouseOver: function mouseOver(e) {
      var link = e.target.parentNode.href;
      var imdbId = link.match(/nm[0-9]*/g)[0];

      var position = {
        top: e.pageY - 200 - 15 + 'px',
        left: e.pageX + 'px'
      };

      api.showCard(position);

      api.getActorData(imdbId).then(function (response) {
        //populate card
        api.populateCard(response.data);
      });
    },
    mouseOut: function mouseOut() {
      api.hideCard();
    }
  },
  createCard: function createCard() {
    api.card.domRef = document.createElement('div');
    api.card.domRef.classList.add('helper-card');
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
  },
  showCard: function showCard(position) {
    api.card.domRef.classList.add('show');
    api.card.domRef.style.top = position.top;
    api.card.domRef.style.left = position.left;
  },
  hideCard: function hideCard() {
    api.card.domRef.classList.remove('show');
    api.card.content.image.src = '';
  },
  _attachEventHandlers: function _attachEventHandlers() {
    var actorsDomElements = document.querySelectorAll('.cast_list .itemprop a');

    var THROTTLE_TIME = 500;

    [].forEach.call(actorsDomElements, function (actor) {
      actor.addEventListener('mouseover', _.throttle(api.handlers.mouseOver, THROTTLE_TIME));
      actor.addEventListener('mouseout', _.throttle(api.handlers.mouseOut, THROTTLE_TIME));
    });
  },
  init: function init() {
    api.createCard();
    api._attachEventHandlers();
  }
};

api.init();
//# sourceMappingURL=content.js.map
