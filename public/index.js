/* eslint-disable */
const process = require('process');

module.exports = function() {
  var params = window.Qs.parse(window.location.search, { ignoreQueryPrefix: true });

  try {
    loadLinkPage(window.jwt_decode(params.child_token));
  } catch (e) {
    loadInvalidTokenPage();
  }

  function loadLinkPage(token) {
    var linkEl = document.getElementById('link');
    var skipEl = document.getElementById('skip');

    var authorize = function(domain, qs) {
      var query = keysForObject(qs)
        .filter(function(key) {
          return !!qs[key];
        })
        .map(function(key) {
          return key + '=' + encodeURIComponent(qs[key]);
        })
        .join('&');

      window.location = domain + 'authorize?' + query;
    };

    var updateContinueUrl = function(el, domain, state) {
      el.href = domain + 'continue?state=' + state;
    };

    linkEl.addEventListener('click', function(e) {
      authorize(token.iss, {
        client_id: params.client_id,
        redirect_uri: params.redirect_uri,
        response_type: params.response_type,
        response_mode: params.response_mode,
        scope: params.scope,
        state: params.original_state,
        nonce: params.nonce,
        audience: params.audience,
        link_account_token: params.child_token,
        prevent_sign_up: true,
        allowed_connections: params.allowed_connections,
        connection: "Username-Password-Authentication" // (EW) this is require, otherwise auth0 fail the request, unfortunately with non descriptive error
      });
    });

    updateContinueUrl(skipEl, token.iss, params.state);

    if (params.error_type === 'accountMismatch') {
      loadAccountMismatchError();
    }
  }

  function loadInvalidTokenPage() {
    var containerEl = document.getElementById('content-container');
    var labelEl = document.getElementById('label-value');
    var linkEl = document.getElementById('link');

    containerEl.innerHTML = '';
    containerEl.appendChild(
      el('div', {}, [
        el('p', {}, [
          text(
            window.Auth0AccountLinkingExtension.locale.pageMismatchError ||
              'You seem to have reached this page in error. Please try logging in again'
          )
        ])
      ])
    );

    linkEl.disabled = true;
  }

  function loadAccountMismatchError() {
    var messageEl = document.getElementById('error-message');
    var msg =
      window.Auth0AccountLinkingExtension.locale.sameEmailAddressError ||
      'Accounts must have matching email addresses. Please try again.';

    messageEl.innerHTML = msg;
    messageEl.style.display = 'block';
  }

  function el(tagName, attrs, childEls) {
    var element = document.createElement(tagName);
    var children = childEls || [];
    var attributes = attrs || {};
    var i;

    for (i in keysForObject(attributes)) {
      element.setAttribute(i, attributes[i]);
    }

    for (i in children) {
      element.appendChild(children[i]);
    }

    return element;
  }

  function text(content) {
    return document.createTextNode(content);
  }

  function keysForObject(obj) {
    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }

    return keys;
  }
}
