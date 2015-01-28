open-dropdown directive for AngularJS
========================

This directive allows your inputs to grow as soon as user types.
The input's width always fit the text user typed in the input.

Open samples/index.html to see the example how to use this directive.

**Installation**

1. Run bower install angular-open-dropdown --save

    *or add manually into your bower.json dependencies and run bower-install*
    
    *or download ZIP from github and extract files in the case if you don't use bower*
    
2. Include `bower_components/angular-open-dropdown/dist/angular-open-dropdown.js` and 
 `bower_components/angular-open-dropdown/dist/angular-open-dropdown.css` in your `index.html` file

3. Add a new dependency module in your `angular.module('yourApp', ['openDropdown', ...])`

**How to use it**

Basically you need to assign on any clickable element an unique id (lets say "my-button"), for example:

```<button id="my-button">Click on this button to open dropdown</button>```

Then create a `open-dropdown` directive and specify this id in the "for" attribute like this:

```<open-dropdown for="my-button">Content you want to show in your modal</open-dropdown>```

Full code:

```html
    <button id="my-button">Click on this button to open dropdown</button>
    <open-dropdown for="my-button">
        <h1>Hello World in the open-dropdown!</h1>
    </open-dropdown>
```

**Options**

```html
   <open-dropdown for="targetElementId" toggle-click="true|false" is-opened="expression|boolean"></open-dropdown>
```

| Option name  | Option type        | Option description                                                                                                                                             | Is required | Is watched |
|--------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|------------|
| for          | string             | The id of the element by click on which the dropdown will open                                                                                                 | yes         | false      |
| toggle-click | boolean            | Indicates if dropdown opened state should be toggled by click on the element (e.g. dropdown will be closed if its opened and user clicked on the button again) | no          | false      |
| is-opened    | expression|boolean | Indicates if dropdown is currently opened or not. This is used to control the open state of the dropdown manually                                              | no          | true       |

**TODO-s (for contributors)**:

    * refactor some parts of code and make it easier to understand and maintain
    * better documentation and more examples if possible
    * cover sources with unit-tests
    * research in performance optimizations
    * search for bugs and fix them
    * star this project and get people to know about this plugin in angular community