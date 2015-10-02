# aw-select
ultralight javascript dummy selectbox

## changelog
- 2.10.2015 - major parts rewritten, filter added
- 1.10.2015 - fixes, small improvements
- 30.9.2015 - first version, initial commit, buggy



## settings
```javascript

    selectedValue: null,
    selectClassName: 'aw-select', 
    selectHeaderAllowHtml: true,
    filterShow: true,
    filterText: 'filter',
    filterNoResult: 'Sorry, no results ...',

    onCreate: function(fakeSelect, nativeSelect) {

    },

    onOpen: function(fakeSelect, nativeSelect) {

    },

    onChoseItem: function(fakeSelect, nativeSelect, item) {

    },

    onClose: function(fakeSelect, nativeSelect) {

    },

    selectOptionText: function(option, optionText) {

      return optionText;
    }
  ```
 
## [see demo](http://code.rjwebdesign.cz/aw-select/)

