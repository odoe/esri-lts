require([
  'esri/Map',
  'esri/views/MapView',

  'esri/layers/FeatureLayer',

  'esri/renderers/SimpleRenderer',
  'esri/symbols/SimpleMarkerSymbol',

  'dojo/domReady!'
],
function (
  Map, MapView,
  FeatureLayer,
  SimpleRenderer, SimpleMarkerSymbol
) {

  var map = new Map({
    basemap: 'streets-navigation-vector'
  });

  var view = new MapView({
    container: 'viewDiv',
    map: map,
    center: [-111.442, 34.613],
    zoom: 17,
    padding: {
      top: 80
    }
  });

  /********************
   * Add feature layer
   ********************/

  // Carbon storage of trees in Warren Wilson College.
  featureLayer = new FeatureLayer({
    url: 'http://services.arcgis.com/ldUM9mnXaowg9XKm/arcgis/rest/services/Microbreweries_as_of_November_4th_2013/FeatureServer/0',
    outFields: ['*'],

    // add a custom action
    popupTemplate: {
      title: '{Name}',
      content: '{*}',
      actions: [{
          id: 'find-brewery',
          className: 'esri-icon-description',
          title: 'Brewery Info'
      }]
    }
  });

  map.add(featureLayer);
  view.then(function() {
    return featureLayer;
  }).then(function() {
    view.extent = featureLayer.fullExtent;
    var popup = view.popup;
    popup.set('dockOptions', {
      position: 'right'
    });
    popup.viewModel.on('trigger-action', function (evt) {
      if (evt.action.id === 'find-brewery') {
        var attributes = popup.viewModel.selectedFeature.attributes;
        var info = attributes.Address_and_Info;
        var strings = info.split(",");
        var url = strings.find(function(s) {
          return s.indexOf('.com') > -1 || s.indexOf('.net') > -1 || s.indexOf('.biz') > -1;
        });
        if (url) {
          window.open('//' + url.trim());
        } else {
          window.open('https://www.google.com/search?q=' + attributes.Name);
        }
      } else if (evt.action.id === 'zoom-out') {
        view.animateTo({
          center: view.center,
          zoom: view.zoom - 2
        });
      }
    });
  });
});