(() => {
  // node_modules/@shopify/theme-sections/section.js
  var SECTION_ID_ATTR = "data-section-id";
  function Section(container, properties) {
    this.container = validateContainerElement(container);
    this.id = container.getAttribute(SECTION_ID_ATTR);
    this.extensions = [];
    Object.assign(this, validatePropertiesObject(properties));
    this.onLoad();
  }
  Section.prototype = {
    onLoad: Function.prototype,
    onUnload: Function.prototype,
    onSelect: Function.prototype,
    onDeselect: Function.prototype,
    onBlockSelect: Function.prototype,
    onBlockDeselect: Function.prototype,
    extend: function extend(extension) {
      this.extensions.push(extension);
      var extensionClone = Object.assign({}, extension);
      delete extensionClone.init;
      Object.assign(this, extensionClone);
      if (typeof extension.init === "function") {
        extension.init.apply(this);
      }
    }
  };
  function validateContainerElement(container) {
    if (!(container instanceof Element)) {
      throw new TypeError("Theme Sections: Attempted to load section. The section container provided is not a DOM element.");
    }
    if (container.getAttribute(SECTION_ID_ATTR) === null) {
      throw new Error("Theme Sections: The section container provided does not have an id assigned to the " + SECTION_ID_ATTR + " attribute.");
    }
    return container;
  }
  function validatePropertiesObject(value) {
    if (typeof value !== "undefined" && typeof value !== "object" || value === null) {
      throw new TypeError("Theme Sections: The properties object provided is not a valid");
    }
    return value;
  }
  if (typeof Object.assign != "function") {
    Object.defineProperty(Object, "assign", {
      value: function assign(target) {
        "use strict";
        if (target == null) {
          throw new TypeError("Cannot convert undefined or null to object");
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];
          if (nextSource != null) {
            for (var nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }

  // node_modules/@shopify/theme-sections/theme-sections.js
  var SECTION_TYPE_ATTR = "data-section-type";
  var SECTION_ID_ATTR2 = "data-section-id";
  window.Shopify = window.Shopify || {};
  window.Shopify.theme = window.Shopify.theme || {};
  window.Shopify.theme.sections = window.Shopify.theme.sections || {};
  var registered = window.Shopify.theme.sections.registered = window.Shopify.theme.sections.registered || {};
  var instances = window.Shopify.theme.sections.instances = window.Shopify.theme.sections.instances || [];
  function register2(type, properties) {
    if (typeof type !== "string") {
      throw new TypeError("Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered");
    }
    if (typeof registered[type] !== "undefined") {
      throw new Error('Theme Sections: A section of type "' + type + '" has already been registered. You cannot register the same section type twice');
    }
    function TypedSection(container) {
      Section.call(this, container, properties);
    }
    TypedSection.constructor = Section;
    TypedSection.prototype = Object.create(Section.prototype);
    TypedSection.prototype.type = type;
    return registered[type] = TypedSection;
  }
  function load2(types, containers) {
    types = normalizeType(types);
    if (typeof containers === "undefined") {
      containers = document.querySelectorAll("[" + SECTION_TYPE_ATTR + "]");
    }
    containers = normalizeContainers(containers);
    types.forEach(function(type) {
      var TypedSection = registered[type];
      if (typeof TypedSection === "undefined") {
        return;
      }
      containers = containers.filter(function(container) {
        if (isInstance(container)) {
          return false;
        }
        if (container.getAttribute(SECTION_TYPE_ATTR) === null) {
          return false;
        }
        if (container.getAttribute(SECTION_TYPE_ATTR) !== type) {
          return true;
        }
        instances.push(new TypedSection(container));
        return false;
      });
    });
  }
  function unload(selector) {
    var instancesToUnload = getInstances(selector);
    instancesToUnload.forEach(function(instance) {
      var index = instances.map(function(e) {
        return e.id;
      }).indexOf(instance.id);
      instances.splice(index, 1);
      instance.onUnload();
    });
  }
  function getInstances(selector) {
    var filteredInstances = [];
    if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) {
      var firstElement = selector[0];
    }
    if (selector instanceof Element || firstElement instanceof Element) {
      var containers = normalizeContainers(selector);
      containers.forEach(function(container) {
        filteredInstances = filteredInstances.concat(instances.filter(function(instance) {
          return instance.container === container;
        }));
      });
    } else if (typeof selector === "string" || typeof firstElement === "string") {
      var types = normalizeType(selector);
      types.forEach(function(type) {
        filteredInstances = filteredInstances.concat(instances.filter(function(instance) {
          return instance.type === type;
        }));
      });
    }
    return filteredInstances;
  }
  function getInstanceById(id) {
    var instance;
    for (var i = 0; i < instances.length; i++) {
      if (instances[i].id === id) {
        instance = instances[i];
        break;
      }
    }
    return instance;
  }
  function isInstance(selector) {
    return getInstances(selector).length > 0;
  }
  function normalizeType(types) {
    if (types === "*") {
      types = Object.keys(registered);
    } else if (typeof types === "string") {
      types = [types];
    } else if (types.constructor === Section) {
      types = [types.prototype.type];
    } else if (Array.isArray(types) && types[0].constructor === Section) {
      types = types.map(function(TypedSection) {
        return TypedSection.prototype.type;
      });
    }
    types = types.map(function(type) {
      return type.toLowerCase();
    });
    return types;
  }
  function normalizeContainers(containers) {
    if (NodeList.prototype.isPrototypeOf(containers) && containers.length > 0) {
      containers = Array.prototype.slice.call(containers);
    } else if (NodeList.prototype.isPrototypeOf(containers) && containers.length === 0) {
      containers = [];
    } else if (containers === null) {
      containers = [];
    } else if (!Array.isArray(containers) && containers instanceof Element) {
      containers = [containers];
    }
    return containers;
  }
  if (window.Shopify.designMode) {
    document.addEventListener("shopify:section:load", function(event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector("[" + SECTION_ID_ATTR2 + '="' + id + '"]');
      if (container !== null) {
        load2(container.getAttribute(SECTION_TYPE_ATTR), container);
      }
    });
    document.addEventListener("shopify:section:unload", function(event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector("[" + SECTION_ID_ATTR2 + '="' + id + '"]');
      var instance = getInstances(container)[0];
      if (typeof instance === "object") {
        unload(container);
      }
    });
    document.addEventListener("shopify:section:select", function(event) {
      var instance = getInstanceById(event.detail.sectionId);
      if (typeof instance === "object") {
        instance.onSelect(event);
      }
    });
    document.addEventListener("shopify:section:deselect", function(event) {
      var instance = getInstanceById(event.detail.sectionId);
      if (typeof instance === "object") {
        instance.onDeselect(event);
      }
    });
    document.addEventListener("shopify:block:select", function(event) {
      var instance = getInstanceById(event.detail.sectionId);
      if (typeof instance === "object") {
        instance.onBlockSelect(event);
      }
    });
    document.addEventListener("shopify:block:deselect", function(event) {
      var instance = getInstanceById(event.detail.sectionId);
      if (typeof instance === "object") {
        instance.onBlockDeselect(event);
      }
    });
  }

  // app/scripts/common/theme-section.js
  Object.assign(window, {
    load: load2,
    register: register2
  });

  // app/scripts/theme.js
  /*@license
    Gofarm by ShopThemes (https://www.shopthemes.net)
    Access unminified JS in assets/theme.js
    */
  register("featured-product", {
    onLoad: function() {
      if (document.getElementsByClassName("productSlider").length > 0) {
        var slider = tns({
          container: ".productSlider",
          items: 1,
          slideBy: 1,
          mouseDrag: true,
          gutter: 30,
          swipeAngle: false,
          nav: true,
          navPosition: "bottom",
          speed: 400,
          controlsContainer: "#controls",
          prevButton: ".arrow__left",
          nextButton: ".arrow__right",
          responsive: {
            768: {
              items: 2
            },
            1024: {
              nav: false
            },
            1280: {
              items: 3
            },
            1500: {
              items: 4
            }
          }
        });
      }
    },
    onUnload: function() {
    },
    onSelect: function() {
    },
    onDeselect: function() {
    },
    onBlockSelect: function(e) {
    },
    onBlockDeselect: function(e) {
    }
  });
  load("*");
  register("product-review", {
    onLoad: function() {
      const jsonDataProductReview = JSON.parse(this.container.querySelector("#reviewSlider").innerText);
      const num = jsonDataProductReview.number;
      console.log(jsonDataProductReview);
      var Customerslider = tns({
        container: ".Slider",
        items: 1,
        slideBy: 1,
        mouseDrag: true,
        swipeAngle: false,
        nav: true,
        navPosition: "bottom",
        controlsContainer: "#controls-customer",
        prevButton: ".prevButton",
        nextButton: ".nextButton",
        speed: 400,
        responsive: {
          400: {
            items: 1
          },
          640: {
            edgePadding: 20,
            gutter: 20,
            items: 2
          },
          700: {
            gutter: 30
          },
          900: {
            items: num
          }
        }
      });
    },
    onchange: function() {
    },
    onUnload: function() {
    },
    onSelect: function() {
    },
    onDeselect: function() {
    },
    onBlockSelect: function(e) {
    },
    onBlockDeselect: function(e) {
    }
  });
  load("*");
  register("single-banner", {
    onLoad: function() {
      const jsonData = JSON.parse(this.container.querySelector("#btnBanner").innerText);
      console.log(jsonData);
      const color = jsonData.color;
      const blockId = jsonData.blockId;
      function shadeColor1(color2, percent) {
        var num = parseInt(color2.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 255) + amt, B = (num & 255) + amt;
        return "#" + (16777216 + (R < 255 ? R < 1 ? 0 : R : 255) * 65536 + (G < 255 ? G < 1 ? 0 : G : 255) * 256 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
      }
      if (color) {
        let btn = document.querySelector(`.singleBanner__btnBlock-${blockId}`);
        let percent = 30;
        var gradientColor = `linear-gradient(90deg, ${shadeColor1(color, percent * -1)}, ${color} 50% , ${shadeColor1(color, percent)} 100%)`;
        btn.style.background = gradientColor;
      }
      console.log(color);
      document.addEventListener("DOMContentLoaded", function() {
      });
    },
    onchange: function() {
    },
    onUnload: function() {
    },
    onSelect: function() {
    },
    onDeselect: function() {
    },
    onBlockSelect: function(e) {
    },
    onBlockDeselect: function(e) {
    }
  });
  load("*");
})();
