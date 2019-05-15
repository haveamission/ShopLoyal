(function(clientId, realmUrl, requestPath) {
    var responseMode = 'fragment';
    var responseType = 'code';
    var callbackStorage;
    var LocalStorage = function() {
        if (!(this instanceof LocalStorage)) {
            return new LocalStorage();
        }
        localStorage.setItem('kc-test', 'test');
        localStorage.removeItem('kc-test');
        var cs = this;
        function clearExpired() {
            var time = new Date().getTime();
            for (var i = 0; i < localStorage.length; i++)  {
                var key = localStorage.key(i);
                if (key && key.indexOf('kc-callback-') == 0) {
                    var value = localStorage.getItem(key);
                    if (value) {
                        try {
                            var expires = JSON.parse(value).expires;
                            if (!expires || expires < time) {
                                localStorage.removeItem(key);
                            }
                        } catch (err) {
                            localStorage.removeItem(key);
                        }
                    }
                }
            }
        }
        cs.get = function(state) {
            if (!state) {
                return;
            }
            var key = 'kc-callback-' + state;
            var value = localStorage.getItem(key);
            if (value) {
                localStorage.removeItem(key);
                value = JSON.parse(value);
            }
            clearExpired();
            return value;
        };
        cs.add = function(state) {
            clearExpired();
            var key = 'kc-callback-' + state.state;
            state.expires = new Date().getTime() + (60 * 60 * 1000);
            localStorage.setItem(key, JSON.stringify(state));
        };
    };
    var CookieStorage = function() {
        if (!(this instanceof CookieStorage)) {
            return new CookieStorage();
        }
        var cs = this;
        cs.get = function(state) {
            if (!state) {
                return;
            }
            var value = getCookie('kc-callback-' + state);
            setCookie('kc-callback-' + state, '', cookieExpiration(-100));
            if (value) {
                return JSON.parse(value);
            }
        };
        cs.add = function(state) {
            setCookie('kc-callback-' + state.state, JSON.stringify(state), cookieExpiration(60));
        };
        cs.removeItem = function(key) {
            setCookie(key, '', cookieExpiration(-100));
        };
        var cookieExpiration = function (minutes) {
            var exp = new Date();
            exp.setTime(exp.getTime() + (minutes*60*1000));
            return exp;
        };
        var getCookie = function (key) {
            var name = key + '=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        };
        var setCookie = function (key, value, expirationDate) {
            var cookie = key + '=' + value + '; '
                + 'expires=' + expirationDate.toUTCString() + '; ';
            document.cookie = cookie;
        }
    };
	var CallbackParser = function(uriToParse, responseMode) {
	    if (!(this instanceof CallbackParser)) {
	        return new CallbackParser(uriToParse, responseMode);
	    }
	    var parser = this;
	    var initialParse = function() {
	        var baseUri = null;
	        var queryString = null;
	        var fragmentString = null;
	        var questionMarkIndex = uriToParse.indexOf("?");
	        var fragmentIndex = uriToParse.indexOf("#", questionMarkIndex + 1);
	        if (questionMarkIndex == -1 && fragmentIndex == -1) {
	            baseUri = uriToParse;
	        } else if (questionMarkIndex != -1) {
	            baseUri = uriToParse.substring(0, questionMarkIndex);
	            queryString = uriToParse.substring(questionMarkIndex + 1);
	            if (fragmentIndex != -1) {
	                fragmentIndex = queryString.indexOf("#");
	                fragmentString = queryString.substring(fragmentIndex + 1);
	                queryString = queryString.substring(0, fragmentIndex);
	            }
	        } else {
	            baseUri = uriToParse.substring(0, fragmentIndex);
	            fragmentString = uriToParse.substring(fragmentIndex + 1);
	        }
	        return { baseUri: baseUri, queryString: queryString, fragmentString: fragmentString };
	    }
	    var parseParams = function(paramString) {
	        var result = {};
	        var params = paramString.split('&');
	        for (var i = 0; i < params.length; i++) {
	            var p = params[i].split('=');
	            var paramName = decodeURIComponent(p[0]);
	            var paramValue = decodeURIComponent(p[1]);
	            result[paramName] = paramValue;
	        }
	        return result;
	    }
	    var handleQueryParam = function(paramName, paramValue, oauth) {
	        var supportedOAuthParams = [ 'code', 'state', 'error', 'error_description' ];
	        for (var i = 0 ; i< supportedOAuthParams.length ; i++) {
	            if (paramName === supportedOAuthParams[i]) {
	                oauth[paramName] = paramValue;
	                return true;
	            }
	        }
	        return false;
	    }
	    parser.parseUri = function() {
	        var parsedUri = initialParse();
	        var queryParams = {};
	        if (parsedUri.queryString) {
	            queryParams = parseParams(parsedUri.queryString);
	        }
	        var oauth = { newUrl: parsedUri.baseUri };
	        for (var param in queryParams) {
	            switch (param) {
	                case 'redirect_fragment':
	                    oauth.fragment = queryParams[param];
	                    break;
	                default:
	                    if (responseMode != 'query' || !handleQueryParam(param, queryParams[param], oauth)) {
	                        oauth.newUrl += (oauth.newUrl.indexOf('?') == -1 ? '?' : '&') + param + '=' + encodeURIComponent(queryParams[param]);
	                    }
	                    break;
	            }
	        }
	        if (responseMode === 'fragment') {
	            var fragmentParams = {};
	            if (parsedUri.fragmentString) {
	                fragmentParams = parseParams(parsedUri.fragmentString);
	            }
	            for (var param in fragmentParams) {
	                oauth[param] = fragmentParams[param];
	            }
	        }
	        return oauth;
	    }
	}
  
    function createCallbackStorage() {
        try {
            return new LocalStorage();
        } catch (err) {}
        return new CookieStorage();
    }
	function parseCallback(url) {
	    var oauth = new CallbackParser(url, responseMode).parseUri();
	    var oauthState = callbackStorage.get(oauth.state);
	    if (oauthState && (oauth.code || oauth.error || oauth.access_token || oauth.id_token)) {
	        oauth.redirectUri = oauthState.redirectUri;
	        oauth.storedNonce = oauthState.nonce;
	        oauth.prompt = oauthState.prompt;
	        if (oauth.fragment) {
	            oauth.newUrl += '#' + oauth.fragment;
	        }
	        return oauth;
	    }
	}
    function processCallback(oauth) {
        var code = oauth.code;
        var error = oauth.error;
        var prompt = oauth.prompt;
        console.dir(oauth)
        if (error) {
            authError();
            return;
        } 
        if (code) {
            var params = 'code=' + code + '&grant_type=authorization_code';
            var url = realmUrl + '/protocol/openid-connect/token';
            var req = new XMLHttpRequest();
            req.open('POST', url, true);
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            params += '&client_id=' + encodeURIComponent(clientId);
            params += '&redirect_uri=' + oauth.redirectUri;
            req.withCredentials = true;
            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        var tokenResponse = JSON.parse(req.responseText);
                        authSuccess(oauth.state, tokenResponse['access_token'], tokenResponse['refresh_token'], tokenResponse['id_token']);
                    } else {
                        authError();
                    }
                }
            };
            req.send(params);
        }
    }
    function authSuccess(state, accessToken, refreshToken, idToken) {
        var cookie = "merchant-access-token=" + accessToken + "; expires=0; path=/; domain=" + getDomain();
        document.cookie = cookie;
        if (state == '/auth/merchant') {
          window.location.replace('/merchant/');
        } else {
          window.location.replace(state); 
        }
    }
    function getDomain() {
      var domain = window.location.hostname
      var firstPeriod = domain.indexOf('.')
      if (/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(domain) || firstPeriod == -1) {
        return domain; 
      }
      return domain.substring(firstPeriod + 1)
    }
    function authError() {
        // TODO: Redirect to 403forbidden.html
        console.log('Error!')
    }
	function createLoginUrl () {
        var state = requestPath;
        var nonce = createUUID();
        var redirectUri = getRedirectUri();
        var callbackState = {
            state: state,
            nonce: nonce,
            redirectUri: encodeURIComponent(redirectUri),
        }
        callbackStorage.add(callbackState);
        var action = 'auth';
        var scope = 'openid';
        var url = realmUrl
            + '/protocol/openid-connect/' + action
            + '?client_id=' + encodeURIComponent(clientId)
            + '&redirect_uri=' + encodeURIComponent(redirectUri)
            + '&state=' + encodeURIComponent(state)
            + '&nonce=' + encodeURIComponent(nonce)
            + '&response_mode=' + encodeURIComponent(responseMode)
            + '&response_type=' + encodeURIComponent(responseType)
            + '&scope=' + encodeURIComponent(scope);
        return url;
    }
    function createUUID() {
        var s = [];
        var hexDigits = '0123456789abcdef';
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = '-';
        var uuid = s.join('');
        return uuid;
    }
    function getRedirectUri() {
        var redirectUri = location.href;
        return redirectUri;
    }
	function init() {
        callbackStorage = createCallbackStorage();
		var callback = parseCallback(window.location.href)
        if (callback) {
          window.history.replaceState({}, null, callback.newUrl);
          processCallback(callback);
        } else {
          window.location.href = createLoginUrl();
        }
	}
    init()	
 
})('@clientId', '@realmUrl', '@requestPath')