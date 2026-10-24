/* Fiche unique : quand on ouvre une page de fiches (dat*.htm) avec une ancre
   (ex. dat20.htm#13), n'afficher que la fiche demandee.
   Un bouton "Voir toute la page" permet de revenir a la page complete.
   Sans ancre, ou si l'ancre est introuvable, la page s'affiche normalement.
   GARDE-FOU : si la structure de la page n'est pas exactement celle attendue
   (separateurs et fiche enfants directs du body), on ne masque rien du tout :
   une page complete vaut mieux qu'une page vide. */
(function () {
  function isoler() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    var nom = decodeURIComponent(hash.substring(1));
    var ancres = document.getElementsByName(nom);
    if (!ancres.length) return;
    var ancre = ancres[0];
    var corps = document.body;
    if (!corps) return;
    // Le <hr> juste avant l'ancre, et le <hr> juste apres.
    var hrs = corps.getElementsByTagName('hr');
    var hrAvant = null, hrApres = null;
    for (var i = 0; i < hrs.length; i++) {
      if (hrs[i].compareDocumentPosition(ancre) & Node.DOCUMENT_POSITION_FOLLOWING) {
        hrAvant = hrs[i];
      } else {
        hrApres = hrs[i];
        break;
      }
    }
    // Garde-fou : si l'ancre ou l'un des separateurs est imbrique dans un
    // autre element (ex. un <blockquote> reste ouvert), la page s'affiche
    // complete, sans rien masquer.
    if (ancre.parentNode !== corps) return;
    if (hrAvant !== null && hrAvant.parentNode !== corps) return;
    if (hrApres !== null && hrApres.parentNode !== corps) return;
    var debut = hrAvant || ancre;
    // Bouton pour revoir toute la page, juste au-dessus de la fiche.
    var bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.textContent = 'Voir toute la page';
    bouton.setAttribute('style', 'display:block;margin:14px auto;padding:10px 18px;font-size:17px;font-weight:bold;color:#004080;background:#fff8dc;border:2px solid #004080;cursor:pointer;');
    bouton.onclick = function () {
      window.location.href = window.location.href.split('#')[0];
    };
    debut.parentNode.insertBefore(bouton, debut);
    // Cacher tout ce qui est hors de l'intervalle [debut, hrApres).
    var enfants = [];
    for (var j = 0; j < corps.childNodes.length; j++) enfants.push(corps.childNodes[j]);
    var dedans = false;
    for (var k = 0; k < enfants.length; k++) {
      var n = enfants[k];
      if (n === bouton) continue;
      if (n === debut) dedans = true;
      if (n === hrApres) dedans = false;
      if (!dedans) {
        if (n.nodeType === 1) {
          var tag = n.tagName;
          if (tag !== 'SCRIPT' && tag !== 'NOSCRIPT' && tag !== 'STYLE') {
            n.style.display = 'none';
          }
        } else if (n.nodeType === 3 && n.nodeValue.replace(/\s/g, '') !== '') {
          var cache = document.createElement('span');
          cache.style.display = 'none';
          n.parentNode.insertBefore(cache, n);
          cache.appendChild(n);
        }
      }
    }
  }
  isoler();
  // Si l'utilisateur clique un lien vers une autre fiche de la MEME page,
  // l'adresse change sans recharger : on recharge pour isoler la nouvelle fiche.
  window.addEventListener('hashchange', function () {
    window.location.reload();
  });
})();
