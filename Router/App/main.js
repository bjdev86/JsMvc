import {Router} from "../Router.js";
import { View } from "../View.js";

export function main (args)
{
    // Instansiate a Router. New Comment
    let theRouter = new Router(new View ("home", "./App/views/home.html", ""));
    
    // Add view routes 
    theRouter.addView(new View("about", "./App/views/about.html", ""))
             .addView(new View("contact", "./App/views/contact.html", ""));
};