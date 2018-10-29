
# Welcome to Product Showcase!

Have you ever wanted to have a flexible product showcase for your Product evaluation Page? Have you thought of what it takes to get the showsace? With product showcase, you can configure position of product display.

**NOTE:** Starting with version 1.1.0 this library is compatible with Angular 6+.

Please send your requests or comments through the link provided below:

[Live Demo](https://flexible-showcase.stackblitz.io)  | [Source code](https://github.com/msalehisedeh/flexible-showcase/tree/master/src/app) | [Comments/Requests](https://github.com/msalehisedeh/flexible-showcase/issues)


# Version 1.2.0
It was brought to my attention that some users have trouble using my components in their angular 6 environment. Since I had only updated few dependencies when moved to Angular 6, I am thinking dependencies are causing issues. So, for this release, I am updating all dependencies to what Angular 6 applications are expecting to have. Please let me know if this is fixing or not fixing any issues you are facing.

# Version 1.1.0
Updated libraries to become compatible with Angular 6+. 

# Version 1.0.0


```javascript
MODULE:
  FlexibleShowcaseModule

EXPORTS:
  FlexibleShowcaseComponent
```

## Features
* Responsive
* ADA Compliant
* Configurable position

### How it can be done?

You will need to set the display in your HTML content:
```javascript
In this example:
1) width and height will control the size of showcase.
2) myPosition can optionally be equal to one of (top, left, right, bottom) options.
3) message is needed to set text in order to make ADA compliant message on each tab.
4) myHoverOption, myTrackOption, and myPickOption are boolean variables.
5) myItems will containe disaplay information

<showcase 
      width="400" 
      height="400"
      message="click to select " 
      [position]="myPosition" 
      [enableEventTracking]="myTrackOption"
      [peekOnHover]="myPickOption"
      [zoomOnHover]="myHoverOption"
      [thumbnails]="myItems"
      [productId]="myProductId"
      (onEventTracking)="onEventTracking($event)"></showcase>


WHERE myItems is equal to a list of thumbnails:

if a thumbnail is of video type, it will look like: 
{
  thumbnailId: string, 
  title: string, 
  type: string, // video
  src: {
    egg: string, // URL
    mp4: string, // URL,
    webm: string, // URL,
  }
}

And for an image type:

{
  thumbnailId: string, 
  title: string, 
  type: string, // image
  src: {
    small: string,
    medium: string, 
    large: string
  }
}

```

You will also need to implement an event handling function if you enable event tracking

```javascript
  onEventTracking(event) {
    // decide on what to do with the event
  }
```

If you want to overide any parts of default look, you can use ::ng-deep and do the following:
```javascript
CSS Example:

::ng-deep .showcase-title {
    text-transform: capitalize;
}
```

![alt text](https://raw.githubusercontent.com/msalehisedeh/flexible-showcase/master/sample.png  "What you would see when a flexible showcase is used")
