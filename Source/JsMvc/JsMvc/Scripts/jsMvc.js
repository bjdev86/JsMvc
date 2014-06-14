﻿;
(function (w, d, undefined) {

    //Flag to indicate if the Mvc manager object can start functioning or not
    var _start = false;
    
    //gets the origin of the current url
    var _origin = w.location.origin;
    
    //gets the pathname of the current url
    var _pathName = w.location.pathname;

    //get the hash of the current url
    var _hash = w.location.hash;

    //Object to store the default route
    var _defaultRoute = null;

    //element that will be used to render the view
    var _viewElement = null;

    //Main Mvc manager object
    var jsMvc = function () {
        //mapping object for the routes
        this._routeMap = {};
    }

    jsMvc.prototype.AddRoute = function (controller, route, template) {
        var routeName = getRouteName(route);
        this._routeMap[getRouteName(route)] = new routeObj(controller, route, template);
    }

    jsMvc.prototype.AddDefault = function (controller, route, template) {
        _defaultRoute = new routeObj(controller, route, template);
    }

    //Initialize the Mvc manager object to start functioning
    jsMvc.prototype.Initialize = function () {
        _start = true;
        
        //if we have only one route then make it the default one
        var allRoutes = Object.getOwnPropertyNames(this._routeMap);
        if (allRoutes.length >= 1 && _defaultRoute === null)
            _defaultRoute = this._routeMap[allRoutes[0]];

        //start the Mvc manager
        this.Start();
    }

    //Start the Mvc manager object to start functioning
    jsMvc.prototype.Start = function () {
        var startMvcDelegate = startMvc.bind(this);
        startMvcDelegate();
        w.onhashchange = startMvcDelegate;
    }

    //Returns the name of the route from the route hash.
    function getRouteNameFromHash(routeHash) {
        var routeParts = getHashArray(routeHash);
        if (routeParts.length >= 2)
            return routeParts[1]
        else
            throw 'Route name cannot be retrieved, hash path is empty';
    }

    //Returns the name of the route from the route path.
    function getRouteName(route) {
        var routeParts = getHashArray(route);
        if (routeParts.length >= 1)
            return routeParts[0]
        else
            throw 'Route name cannot be retrieved, route path is empty';
    }

    //return the hash of a route based on the route name
    function getRouteHash(routeName) {
        var hash = [];
        var hashParts = null;
        var routeObj = null;
        
        if (!routeName) {
            //if no routename is there then use the default route
            routeObj = _defaultRoute;
            hashParts = getHashArray(routeObj.route);
            
            //start constructing the hash 
            hash.push('#');
            for (var i = 0; i < hashParts.length; i++) {
                hash.push('/')
                hash.push(hashParts[i]);
            }

            return hash.join('');
        }
        else {
            //else fetch the route object based on its name
            routeObj = this._routeMap[routeName];
            if (IsNullOrUndefined(routeObj))
                return;
        }
    }

    //Funcion that returns array by splitting hash parts
    function getHashArray(hash) {
        return hash.split('/');
    }

    //Determines if a value is null or undefined
    function IsNullOrUndefined(value) {
        return (value === null || value === undefined);
    }

    //Ajax function to load external html data
    function loadTemplate(routeObject, view) {
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {                
                loadView(routeObject, view, xmlhttp.responseText);
                console.log('Loaded');
            }
        }
        xmlhttp.open('GET', routeObject.template, true);
        xmlhttp.send();
    }

    function loadView(routeObject, viewElement, viewHtml) {
        var model = {};
        
        //get the resultant model from the controller of the current route
        routeObject.controller(model);
        
        //bind the model with the view
        for (var prop in model) {
            viewHtml = viewHtml.replace('{{' + prop + '}}', model[prop]);
        }

        //load the view into the view element
        viewElement.innerHTML = viewHtml;
    }

    //Route Object
    var routeObj = function (c, r, t) {
        this.controller = c;
        this.route = r;
        this.template = t;

    }

    w['jsMvc'] = new jsMvc();

    //function to start the mvc support
    function startMvc() {
        var pageHash = w.location.hash.replace('#', '');
        var hashParts = null;
        var routeName = null;
        var routeObj = null;

        //get the html element that will be used to render the view
        _viewElement = d.querySelector('[view]')
        //do nothing if view element is not found
        if (!_viewElement) return;

        if (pageHash === '') {
            //if there is no hash then redirect to the location with the hash of the default route
            SetDefaultRoute();
        }
        else {
            //get the name of the route from the hash
            routeName = getRouteNameFromHash(pageHash);

            //get the route object
            routeObj = this._routeMap[routeName];
            //if not found then do nothing
            if (!routeObj) {
                SetDefaultRoute();
                return;
            }

            //fetch and set the view of the route
            loadTemplate(routeObj, _viewElement);
        }
    }

    //Function to redirect to the default route
    function SetDefaultRoute() {
        w.location.replace(_origin + _pathName + getRouteHash());
    }

})(window, document);