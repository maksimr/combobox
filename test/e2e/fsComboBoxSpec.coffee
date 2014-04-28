describe 'ComboBox', ->
  $ptor = protractor

  pressEnter = (element) ->
    element.sendKeys("\n")

  beforeEach ->
    browser.get('combobox.html')

  it 'should open dropdown on click' , ->
    expect($('.js-combobox .dropdown.f-list').isPresent()).toBe(false)
    $('.combobox-select').click()

    expect($('.js-combobox .dropdown.f-list').isPresent()).toBe(true)

  it 'should allow to select value with mouse click', ->
    $('.js-combobox .combobox-select').click()
    $('.js-combobox .dropdown.f-list li:first-child a').click()

    expect($('#valueId').getText()).toBe('first')

  it 'should allow to select value with enter key', ->
    $('.js-combobox .combobox-select').click()
    pressEnter($('.js-combobox input'))
    expect($('#valueId').getText()).toBe('first')

  it 'should allow to navigate through list with arrows', ->
    $('.js-combobox .combobox-select').click()
    $('.js-combobox input').sendKeys($ptor.Key.DOWN) for [1..10]
    pressEnter($('.js-combobox input'))
    expect($('#valueId').getText()).toBe('second')

  it 'should filter dropdown items with entered text', ->
    $('.js-combobox .combobox-select').click()
    input = $('.js-combobox input')
    input.sendKeys("")
    expect(element.all(By.css(".js-combobox .dropdown-menu li")).count()).toBe(3)

    input.clear()
    input.sendKeys("first")
    filteredItems = element.all(By.css(".js-combobox .dropdown-menu li"))

    expect(filteredItems.count()).toBe(1)
    expect(filteredItems.first().getText()).toBe('first')

  it 'should not select anything on Enter when items doesnt match entered search text', ->
    $('.js-combobox input').click()
    input = $('.js-combobox input')
    input.sendKeys("foobarbaz")

    $('.js-combobox input').sendKeys($ptor.Key.ENTER)
    expect($('#valueId').getText()).toBe('foobarbaz')
