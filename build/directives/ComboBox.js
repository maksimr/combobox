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
