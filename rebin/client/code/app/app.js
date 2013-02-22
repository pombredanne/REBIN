$(function() {
  var Endpoint, EndpointList, EndpointForm, endpoints;
  
  Endpoint = syncedModel.extend({}, { modelname: "Endpoint" });
  
  EndpointList = syncedCollection.extend({ model: Endpoint }, { modelname: "Endpoint" });
  
  endpoints = new EndpointList;
  
  EndpointSchema = {
    id: 'Number',
    name: {type: 'Text', validators: ['required']},
    url: {type: 'Text', validators: ['required']},
    path: {type: 'Text', validators: ['required']},
    parameters: 'List'
  }
  
  // override marionette's template rendering to use hogan.js from socketstream
  Marionette.Renderer.render = function(template, data){
    if (!ss.tmpl[template]) throw "Template '" + template + "' not found!";
    return ss.tmpl[template].render(data);
  }
  
  var App = new Marionette.Application();
  
  App.addRegions({
    breadcrumbs: '#breadcrumbs',
    main: '#main'
  });
  
  App.addInitializer(function(){
    var router = new Router();
    endpoints.fetch();
  });
  
  var EndpointView = Marionette.ItemView.extend({
    initialize: function() {
      // this.bindTo(this.model, 'change', this.render);
      _.bindAll(this);
      this.model.on('change', this.render);
    },
    
    tagName: "tr",
    template: "endpoint-item"
  });
  
  var EndpointListView = Marionette.CompositeView.extend({
    template: "endpoint-list",
    itemView: EndpointView,
    itemViewContainer: "#endpoints-list",

  });
  
  var EndpointDetailView = Marionette.ItemView.extend({
    template: "endpoint-detail",
    
    events: {
      'click #delete': 'deleteEndpoint'
    },
    
    deleteEndpoint: function() {
      this.model.destroy();
    }
    
  });
  
  var EndpointFormLayout = Marionette.Layout.extend({
    template: "endpoint-form_layout",
    
    regions: {
      form: "#form",
      form_actions: "#form_actions"
    },
    
    events: {
      'click #save': 'saveEndpoint'
    },
    
    saveEndpoint: function() {
      var end;
      var data = EndpointForm.getValue();
      EndpointForm.remove();
      if (data.id === 0) {
        delete data.id;
        end = new Endpoint(data);
      } else {
        end = endpoints.get(data.id);
        end.set(data);
      }
      end.save();
    }
  });
  
  var EndpointFormActions = Marionette.ItemView.extend({
    template: "endpoint-form_actions"
  });
  
  var Router = Backbone.Router.extend({
    routes: {
      "": "showEndpointsList",
      "endpoints": "showEndpointsList",
      "endpoints/add": "addEndpoint",
      "endpoints/show/:id": "showEndpoint",
      "endpoints/edit/:id": "editEndpoint"
    },
    
    addEndpoint: function() {
      var endpointFormLayout = new EndpointFormLayout();
      App.main.show(endpointFormLayout);
      
      EndpointForm = new Backbone.Form({ schema: EndpointSchema });
      endpointFormLayout.form.show(EndpointForm);
      endpointFormLayout.form_actions.show(new EndpointFormActions());
    },
    
    showEndpointsList: function(){
      App.main.show(new EndpointListView({
        collection: endpoints
      }));
    },
    
    showEndpoint: function(id){
      App.main.show(new EndpointDetailView({
        model: endpoints.get(id)
      }));
    },
    
    editEndpoint: function(id){
      var endpointFormLayout = new EndpointFormLayout();
      App.main.show(endpointFormLayout);
      
      EndpointForm = new Backbone.Form({ schema: EndpointSchema });
      EndpointForm.data = endpoints.get(id).toJSON();
      endpointFormLayout.form.show(EndpointForm);
      endpointFormLayout.form_actions.show(new EndpointFormActions());
    },
  });
  
  App.on("initialize:after", function(){
    if (Backbone.history){
      Backbone.history.start();
    }
  });
  
  App.start();

});