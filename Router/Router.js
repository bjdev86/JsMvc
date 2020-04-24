
/**
 * This class must, 
 * 
 *  1. Listen for windows location change events 
 * 
 *  2. Match the route in the address bar (URL) to a route held in the router map.
 * 
 *  3. Change the view in the index.html page 
 * 
 */
import {View} from "./View.js"; 

export class Router
{
    // Private Data Members 
    //#routeMap;
    /**
     * Instansiates a new Router object. A default view can be set. 
     * 
     * @param {View} dfltView The home view. 
     */
    constructor (dfltView = new View("home", "view/home.html"))
    {
        // Instansiate a router mapping. Views will be stored by name. 
        this._routeMap = {}; 
        
        // The name of the default view
        this._defaultViewName = dfltView._name;

        // Set the default Route. In this case it's the home view
        this._routeMap[this._defaultViewName] = dfltView;

        // Set the hash change method for the window in which this script is running.
        window.onhashchange = this.switchView.bind(this);

        // Get the HTML element from the index.html page where content will be displayed 
        this._viewSpace = window.document.getElementById("fw-view"); 
    }

    // Getters and Setters
    get routeMap ()
    {
        return this._routeMap;
    }
    set routeMap (routes)
    {
        this._routeMap = routes;
    } 

    /**
     * Function to add a new view to the router, so that it may be routed to by the router. 
     * This object reference is returned, so that it can be chain called 
     * 
     * @param {View} view The view to be added  
     */
    addView (view)
    {
        this._routeMap[view._name] = view; 
        return this;
    }

    /**
     * Function to set the default view for the router map.
     * @param {*} view 
     */
    defaultView (view)
    {
        this._routeMap["defaultView"] = view; 
    }

    /**
     * Function to respond when the hash fragment of the URL for the page is changed. The 
     * hansh fragment indicates which view needs to be fetched and placed on the index.html page.
     */
    switchView ()
    {
        // Capture the hash fragment the browser just navigated to
        let viewName = window.location.hash.replace("#", ""); 

        // Match the view name to a view in the routing map
        let viewRef = this.resolveView(viewName);

        // Load the view's template in to the index.html page in which this script runs.
        this.insertViewToHTML(viewRef.tmpltURL);
    }

    /**
     * Attempt to match the view name with the view from the route map.
     * 
     * @param {String} name The name of the view to be matched in the route map. 
     */
    resolveView (name)
    {
        // Local Variable Declaration 
        let view; 

        // See if the routeMap has the view requested
        if (this._routeMap.hasOwnProperty(name)) 
        {
            view = this._routeMap[name];
        }
        else
        {
            // Get the default view if no other can found
            view = this._routeMap[this._defaultViewName] 
        }

        return view; 
    }

    /**
     * 
     * @param {String} tmpltURL The URL to the view HTML template 
     */
    async insertViewToHTML(tmpltURL)
    {
        // Fetch the HTML view template 
        let tmpltHTML = await this.loadView(tmpltURL);

        // Set the HTML of the view element on the index page
        this._viewSpace.innerHTML = tmpltHTML; 
    }

    /**
     * 
     */
    async loadView(URL)
    {
        // Local Variable Declaration 
        let template

        try 
        {
            // Fetch the HTML file 
            let res = await window.fetch(URL); 

            // Get the contents of that fetched HTML file, the template HTML
            template = await res.text(); 
        } 
        catch (error) 
        {
            // Capture the error text for the main content section of the page
            template = error.toString;
        }
        
        return template;
    }

}


