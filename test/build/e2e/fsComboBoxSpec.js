(function() {
  describe('ComboBox', function() {
    var $ptor, pressEnter;
    $ptor = protractor;
    pressEnter = function(element) {
      return element.sendKeys("\n");
    };
    beforeEach(function() {
      return browser.get('combobox.html');
    });
    it('should open dropdown on click', function() {
      expect($('.js-combobox .dropdown.f-list').isPresent()).toBe(false);
      $('.combobox-select').click();
      return expect($('.js-combobox .dropdown.f-list').isPresent()).toBe(true);
    });
    it('should allow to select value with mouse click', function() {
      $('.js-combobox .combobox-select').click();
      $('.js-combobox .dropdown.f-list li:first-child a').click();
      return expect($('#valueId').getText()).toBe('first');
    });
    it('should allow to select value with enter key', function() {
      $('.js-combobox .combobox-select').click();
      pressEnter($('.js-combobox input'));
      return expect($('#valueId').getText()).toBe('first');
    });
    it('should allow to navigate through list with arrows', function() {
      var _i;
      $('.js-combobox .combobox-select').click();
      for (_i = 1; _i <= 10; _i++) {
        $('.js-combobox input').sendKeys($ptor.Key.DOWN);
      }
      pressEnter($('.js-combobox input'));
      return expect($('#valueId').getText()).toBe('second');
    });
    it('should filter dropdown items with entered text', function() {
      var filteredItems, input;
      $('.js-combobox .combobox-select').click();
      input = $('.js-combobox input');
      input.sendKeys("");
      expect(element.all(By.css(".js-combobox .dropdown-menu li")).count()).toBe(3);
      input.clear();
      input.sendKeys("first");
      filteredItems = element.all(By.css(".js-combobox .dropdown-menu li"));
      expect(filteredItems.count()).toBe(1);
      return expect(filteredItems.first().getText()).toBe('first');
    });
    return it('should not select anything on Enter when items doesnt match entered search text', function() {
      var input;
      $('.js-combobox input').click();
      input = $('.js-combobox input');
      input.sendKeys("foobarbaz");
      $('.js-combobox input').sendKeys($ptor.Key.ENTER);
      return expect($('#valueId').getText()).toBe('foobarbaz');
    });
  });

}).call(this);
