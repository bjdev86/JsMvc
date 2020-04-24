export class View
{
    constructor (name, tmpltURL, ctrlr)
    {
        this._name = name; 
        this._tmpltURL = tmpltURL;
        this._controller = ctrlr 
    }

    get name ()
    {
        return this._name;
    }
    // Should spaces be allowed
    set name (aName)
    {
        this._name = aName;
    }

    get tmpltURL ()
    {
        return this._tmpltURL;
    }
    set tmpltURL (url)
    {
        this._tmpltURL = url;
    }

    get controller ()
    {
        return this._controller;
    }
    set controller(ctrlr)
    {
        this._controller = ctrlr;
    }
    
}