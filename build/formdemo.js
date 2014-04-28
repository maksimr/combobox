var getComputedStyleFor, innerHeightOf, scrollToTarget;

getComputedStyleFor = function(elem, prop) {
  return parseInt(window.getComputedStyle(elem, null).getPropertyValue(prop));
};

innerHeightOf = function(elem) {
  return elem.clientHeight - getComputedStyleFor(elem, 'padding-top') - getComputedStyleFor(elem, 'padding-bottom');
};

scrollToTarget = function(container, target) {
  var item, viewport;
  if (!(container && target)) {
    return;
  }
  viewport = {
    top: container.scrollTop,
    bottom: container.scrollTop + innerHeightOf(container)
  };
  item = {
    top: target.offsetTop,
    bottom: target.offsetTop + target.offsetHeight
  };
  if (item.bottom > viewport.bottom) {
    return container.scrollTop += item.bottom - viewport.bottom;
  } else if (item.top < viewport.top) {
    return container.scrollTop -= viewport.top - item.top;
  }
};

angular.module('formdemo', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/templates/list.html',
    "<div class=\"dropdown open f-list\">\n" +
    "  <ul class=\"dropdown-menu\"\n" +
    "      role=\"menu\" >\n" +
    "    <li ng-repeat=\"item in items\"\n" +
    "        ng-class=\"{true: 'active'}[$index == highlightIndex]\">\n" +
    "      <a ng-click=\"highlightItem(item)\"\n" +
    "         href=\"javascript:void(0)\"\n" +
    "         tabindex='-1'>\n" +
    "         <span ng-transclude></span>\n" +
    "       </a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</div>\n"
  );

}]);

(function() {
  angular.module("formdemo").value('ComboBoxController', function($scope, $element, $attrs, $filter, $timeout) {
    if ($scope.active == null) {
      $scope.active = false;
    }
    $scope.search = null;
    $scope.$watch('search', function(q) {
      return $scope.updateDropdown();
    });
    $scope.selectItem = function(item) {
      $scope.item = typeof item === 'object' ? item[$scope.searchAttr] : item;
      return $scope.search = null;
    };
    $scope.showDropdown = function() {
      $scope.active = true;
      $scope.search = '';
      return $scope.updateDropdown();
    };
    $scope.updateDropdown = function() {
      var filterParmas;
      filterParmas = $scope.search;
      if ($scope.searchAttr) {
        filterParmas = {};
        filterParmas[$scope.searchAttr] = $scope.search;
      }
      return $scope.dropdownItems = $scope.search != null ? $filter('filter')($scope.items, filterParmas) : [];
    };
    $scope.onBlur = function() {
      return $timeout(function() {
        $scope.active = false;
        return $scope.search = null;
      }, 0, true);
    };
    $scope.move = function(d) {
      if ($scope.search == null) {
        $scope.search = '';
      }
      return $scope.listInterface.move && $scope.listInterface.move(d);
    };
    $scope.onEnter = function(event) {
      if ($scope.dropdownItems.length > 0) {
        return $scope.selectItem($scope.listInterface.selectedItem);
      }
    };
    return $scope.listInterface = {
      onSelect: function(selectedItem) {
        return $scope.selectItem(selectedItem);
      }
    };
  }).directive("combobox", [
    '$compile', 'ComboBoxController', function($compile, ComboBoxController) {
      return {
        restrict: "A",
        scope: {
          items: '=',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          "class": '@',
          name: '@',
          active: '@',
          searchAttr: '@'
        },
        require: '?ngModel',
        replace: true,
        template: function(el) {
          var itemTpl, template;
          itemTpl = el.html();
          return template = "<div class='f-combobox fs-widget-root'>\n  <div class=\"open\">\n    <div class=\"input-group\">\n      <input class=\"form-control\"\n             f-input\n\n             fs-focus-when='active'\n             fs-blur-when='!active'\n             fs-on-focus='active = true'\n             fs-on-blur='onBlur()'\n             fs-hold-focus\n             fs-down='move(1)'\n             fs-up='move(-1)'\n             fs-pg-up='move(-11)'\n             fs-pg-down='move(11)'\n             fs-enter='onEnter($event)'\n             fs-esc='active = false'\n             type=\"text\"\n\n             ng-disabled=\"disabled\"\n             ng-required=\"required\"\n\n             name=\"name\"\n\n             ng-change=\"search = item\"\n\n             placeholder='Search'\n             ng-model=\"item\"\n             />\n\n      <span class=\"input-group-btn\">\n        <button type=\"button\"\n                class=\"btn btn-default combobox-select\"\n                ng-disabled=\"disabled\"\n                ng-click='showDropdown()'><span class=\"caret\"></span></button>\n      </span>\n    </div>\n\n    <div ng-if=\"active && dropdownItems.length > 0\" ng-show=\"active\">\n      <div f-list items=\"dropdownItems\">\n       " + itemTpl + "\n      </div>\n    </div>\n  </div>\n</div>";
        },
        controller: ComboBoxController,
        link: function(scope, element, attrs, ngModelCtrl, transcludeFn) {
          if (ngModelCtrl) {
            if (ngModelCtrl.$viewValue != null) {
              scope.item = ngModelCtrl.$viewValue;
            }
            scope.$watch('item', function(newValue, oldValue) {
              if (newValue !== oldValue) {
                return ngModelCtrl.$setViewValue(scope.item);
              }
            });
            return ngModelCtrl.$render = function() {
              return scope.item = ngModelCtrl.$viewValue;
            };
          }
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module("formdemo").directive("fInput", [
    '$parse', function($parse) {
      return {
        restrict: "A",
        link: function(scope, element, attrs) {
          var blurElement, focusElement, fsRoot, keyCodes;
          focusElement = function() {
            return setTimeout((function() {
              return element[0].focus();
            }), 0);
          };
          blurElement = function() {
            return setTimeout((function() {
              return element[0].blur();
            }), 0);
          };
          keyCodes = {
            Tab: 9,
            ShiftTab: 9,
            Enter: 13,
            Esc: 27,
            PgUp: 33,
            PgDown: 34,
            Left: 37,
            Up: 38,
            Right: 39,
            Down: 40,
            Space: 32
          };
          if (attrs["fsFocusWhen"] != null) {
            scope.$watch(attrs["fsFocusWhen"], function(newValue) {
              if (newValue) {
                return focusElement();
              }
            });
          }
          if (attrs["fsBlurWhen"] != null) {
            scope.$watch(attrs["fsBlurWhen"], function(newValue) {
              if (newValue) {
                return blurElement();
              }
            });
          }
          if (attrs["fsOnFocus"] != null) {
            element.on('focus', function(event) {
              return scope.$apply(attrs["fsOnFocus"]);
            });
          }
          if (attrs["fsOnBlur"] != null) {
            element.on('blur', function(event) {
              return scope.$apply(attrs["fsOnBlur"]);
            });
          }
          if (attrs["fsHoldFocus"] != null) {
            fsRoot = $(element).parents(".fs-widget-root").first();
            fsRoot.on("mousedown", function(event) {
              if (event.target !== element.get(0)) {
                event.preventDefault();
                return false;
              } else {
                return true;
              }
            });
          }
          return angular.forEach(keyCodes, function(keyCode, keyName) {
            var attrName, callbackExpr, shift;
            attrName = 'fs' + keyName;
            if (attrs[attrName] != null) {
              shift = keyName.indexOf('Shift') !== -1;
              callbackExpr = $parse(attrs[attrName]);
              return element.on('keydown', function(event) {
                if (event.keyCode === keyCode && event.shiftKey === shift) {
                  if (!scope.$apply(function() {
                    return callbackExpr(scope, {
                      $event: event
                    });
                  })) {
                    return event.preventDefault();
                  }
                }
              });
            }
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module("formdemo").directive("fList", function() {
    return {
      restrict: "A",
      scope: {
        items: '=',
        "class": '@',
        listInterface: '='
      },
      transclude: true,
      replace: true,
      templateUrl: "/templates/list.html",
      link: function($scope, $element, $attrs) {
        var ensureHighlightedItemVisible;
        ensureHighlightedItemVisible = function() {
          var delayedScrollFn;
          delayedScrollFn = function() {
            var li, ul;
            ul = $element.find('ul')[0];
            li = ul.querySelector('li.active');
            return scrollToTarget(ul, li);
          };
          return setTimeout(delayedScrollFn, 0);
        };
        return $scope.$watch('highlightIndex', function(idx) {
          return ensureHighlightedItemVisible();
        });
      },
      controller: function($scope, $element, $attrs, $filter) {
        var updateSelectedItem;
        updateSelectedItem = function(hlIdx) {
          if ($scope.$parent.listInterface != null) {
            return $scope.$parent.listInterface.selectedItem = $scope.items[hlIdx];
          }
        };
        $scope.highlightItem = function(item) {
          $scope.highlightIndex = $scope.items.indexOf(item);
          return $scope.$parent.listInterface.onSelect(item);
        };
        $scope.$watch('items', function(newItems) {
          $scope.highlightIndex = 0;
          return updateSelectedItem(0);
        });
        $scope.$watch('highlightIndex', function(idx) {
          return updateSelectedItem(idx);
        });
        $scope.move = function(d) {
          var items;
          items = $scope.items;
          $scope.highlightIndex += d;
          if ($scope.highlightIndex === -1) {
            $scope.highlightIndex = items.length - 1;
          }
          if ($scope.highlightIndex >= items.length) {
            return $scope.highlightIndex = 0;
          }
        };
        $scope.highlightIndex = 0;
        if ($scope.$parent.listInterface != null) {
          return $scope.$parent.listInterface.move = function(delta) {
            return $scope.move(delta);
          };
        }
      }
    };
  });

}).call(this);
