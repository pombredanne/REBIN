$(function() {
  var Endpoint, EndpointList, EndpointForm, endpoints;
  
  Endpoint = syncedModel.extend({}, { modelname: "Endpoint" });
  
  EndpointList = syncedCollection.extend({ model: Endpoint }, { modelname: "Endpoint" });
  
  endpoints = new EndpointList;
  
  EndpointSchema = {
    id: 'Number',
    name: {type: 'Text', validators: ['required']},
    url: {type: 'Text', validators: ['required']},
    executable: {type: 'FileSystem', validators: ['required']},
    parameters: 'List'
  }
  
  // override marionette's template rendering to use hogan.js from socketstream
  Marionette.Renderer.render = function(template, data){
    if (!ss.tmpl[template]) throw "Template '" + template + "' not found!";
    return ss.tmpl[template].render(data);
  }
  
  var App = new Marionette.Application();
  
  App.addRegions({
    menu: '#menu',
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
  
  var EndpointListBreadcrumbs = Marionette.ItemView.extend({ template: "endpoint-breadcrumbs_list" });
  var EndpointAddBreadcrumbs = Marionette.ItemView.extend({ template: "endpoint-breadcrumbs_add" });
  var EndpointDetailBreadcrumbs = Marionette.ItemView.extend({ template: "endpoint-breadcrumbs_detail" });
  var EndpointEditBreadcrumbs = Marionette.ItemView.extend({ template: "endpoint-breadcrumbs_edit" });
  var EndpointMenu = Marionette.ItemView.extend({ template: "endpoint-menu" });
  
  // Debug models and views
  
  var Log, LogList, logs;
  
  Log = syncedModel.extend({}, { modelname: "Log" });
  LogList = syncedCollection.extend({ model: Log }, { modelname: "Log" });
  logs = new LogList;
  
  var LogView = Marionette.ItemView.extend({
    initialize: function() {
      _.bindAll(this);
      this.model.on('change', this.render);
    },
    
    tagName: "div",
    template: "log-item"
  });
  
  var LogListView = Marionette.CompositeView.extend({
    template: "log-list",
    itemView: LogView,
    itemViewContainer: "#log-list",
  });
  
  var LogListBreadcrumbs = Marionette.ItemView.extend({ template: "log-breadcrumbs_list" });
  var DebugMenu = Marionette.ItemView.extend({ template: "log-menu" });
  
  var Router = Backbone.Router.extend({
    routes: {
      "": "showEndpointsList",
      "endpoints": "showEndpointsList",
      "endpoints/add": "addEndpoint",
      "endpoints/show/:id": "showEndpoint",
      "endpoints/edit/:id": "editEndpoint",
      
      "debug": "showLogList"
    },
    
    addEndpoint: function() {
      App.menu.show(new EndpointMenu());
      App.breadcrumbs.show(new EndpointAddBreadcrumbs());
      
      var endpointFormLayout = new EndpointFormLayout();
      App.main.show(endpointFormLayout);
      
      EndpointForm = new Backbone.Form({ schema: EndpointSchema });
      endpointFormLayout.form.show(EndpointForm);
      endpointFormLayout.form_actions.show(new EndpointFormActions());
    },
    
    showEndpointsList: function(){
      App.breadcrumbs.show(new EndpointListBreadcrumbs());
      App.menu.show(new EndpointMenu());
      App.main.show(new EndpointListView({
        collection: endpoints
      }));
    },
    
    showEndpoint: function(id){
      App.breadcrumbs.show(new EndpointDetailBreadcrumbs());
      App.menu.show(new EndpointMenu());
      App.main.show(new EndpointDetailView({
        model: endpoints.get(id)
      }));
    },
    
    editEndpoint: function(id){
      App.menu.show(new EndpointMenu());
      App.breadcrumbs.show(new EndpointEditBreadcrumbs());
      
      var endpointFormLayout = new EndpointFormLayout();
      App.main.show(endpointFormLayout);
      
      EndpointForm = new Backbone.Form({ schema: EndpointSchema });
      EndpointForm.data = endpoints.get(id).toJSON();
      endpointFormLayout.form.show(EndpointForm);
      endpointFormLayout.form_actions.show(new EndpointFormActions());
    },
    
    showLogList: function(){
      App.menu.show(new DebugMenu());
      App.breadcrumbs.show(new LogListBreadcrumbs());
      
      logs.fetch();
      App.main.show(new LogListView({
        collection: logs
      }));
    },
    
  });
  
  App.on("initialize:after", function(){
    if (Backbone.history){
      Backbone.history.start();
    }
  });
  
  App.start();
  
  $(document).on("click", ".chooseFile", function() {
    $(".chooseFile").parent().removeClass('chosen');
    $(this).parent().addClass('chosen');
    return false;
  });

});