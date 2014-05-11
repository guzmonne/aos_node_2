describe("App.Models.BaseModel", function() {
  var model;

  beforeEach(function() {
    model = new App.Models.BaseModel();
  });

  it("should call its awake method on initialize", function(){
    spyOn(App.Models.BaseModel.prototype, 'awake');
    var m = new App.Models.BaseModel();
    expect(App.Models.BaseModel.prototype.awake).toHaveBeenCalled();
    m.dispose();
  });

  it("should have an array attribute called children", function() {
    expect(model.children).toEqual([]);
  });

  describe('createChilds()', function(){
    beforeEach(function(){
      this.TestModel = App.Models.BaseModel.extend({
        childs: [
          {
            attribute: 'attribute1',
            type     : 'model',
            name     : 'BaseModel'    
          },
          {
            attribute: 'attribute2',
            type     : 'collection',
            name     : 'BaseCollection'    
          }
        ],
      });
      this.ErrorTestModel1 = App.Models.BaseModel.extend({
        childs: "test",
      });
      this.ErrorTestModel2 = App.Models.BaseModel.extend({
        childs: [1, 2, 4],
      });
      this.ErrorTestModel3 = App.Models.BaseModel.extend({
        childs: [
          {
            type     : 'Model',
            name     : 'Attribute1'    
          },
        ],
      });
      this.ErrorTestModel4 = App.Models.BaseModel.extend({
        childs: [
          {
            attribute: 'attribute',
            type     : 'error',
            name     : 'BaseModel'    
          },
        ],
      });
      this.test = new this.TestModel();
    });

    afterEach(function(){
      this.test.dispose();
      this.test = null;
    });

    it("should call the createChilds function if the objects 'childs' its found", function(){
      spyOn(App.Models.BaseModel.prototype, 'createChilds');
      var m1 = new App.Models.BaseModel();
      expect(App.Models.BaseModel.prototype.createChilds).not.toHaveBeenCalled();
      var m2 = new this.TestModel();
      expect(App.Models.BaseModel.prototype.createChilds).toHaveBeenCalled();
      m1.dispose();
      m2.dispose();
    });

    it("should throw an error if 'childs' is not an array", function(){
      var self = this;
      expect(function(){new self.ErrorTestModel1();}).toThrowError();
    });

    it("should throw an error if 'childs' is not an objects array", function(){
      var self = this;
      expect(function(){new self.ErrorTestModel2();}).toThrowError();
    });

    it("should check for the type of the childs to be correct", function(){
      var self = this;
      expect(function(){new self.ErrorTestModel4();}).toThrowError();
    });

    it("should throw an error if a 'child' doesn't have an 'attribute', 'type', or 'name' key", function(){
      var self = this;
      expect(function(){new self.TestModel();}).not.toThrowError();
      expect(function(){new self.ErrorTestModel3();}).toThrowError();
    });

    it("should add the childs objects to the children array", function(){
      expect(this.test.children.length).toEqual(2);
    });

    it("should create references to the childs", function(){
      expect(this.test.attribute1).not.toBe(undefined);
      expect(this.test.attribute2).not.toBe(undefined);
    });

    it("should set this model as the parent of the childs", function(){
      expect(this.test.attribute1.parent).not.toBe(undefined);
      expect(this.test.attribute2.parent).not.toBe(undefined);
      expect(this.test.attribute1.parent).toEqual(this.test);
      expect(this.test.attribute2.parent).toEqual(this.test);
    });

    it("should make the childs changes trigger a change event on its parent", function(){
      var m = new App.Models.BaseModel();
      fun1 = jasmine.createSpy();
      fun2 = jasmine.createSpy();
      fun3 = jasmine.createSpy();
      m.listenTo(this.test, 'change:attribute1', fun1);
      m.listenTo(this.test, 'change:attribute2', fun2);
      expect(fun1).not.toHaveBeenCalled();
      this.test.attribute1.set('foo', 'bar');
      expect(fun1).toHaveBeenCalled();
      expect(fun2).not.toHaveBeenCalled();
      this.test.attribute2.add({foo: 'bar'});
      expect(fun2).toHaveBeenCalled();
      m.listenTo(this.test, 'change:attribute2', fun3);
      this.test.attribute2.remove(this.test.attribute2.models[0]);
      expect(fun3).toHaveBeenCalled();
      m.dispose();
    });

    it("should call the childs dispose method upon parent dispose", function(){
      var m = new this.TestModel();
      var t = new this.TestModel();
      var spy1 = jasmine.createSpy();
      var spy2 = jasmine.createSpy();
      t.listenTo(m.attribute1, 'disposed', spy1);
      t.listenTo(m.attribute2, 'disposed', spy2);
      m.dispose();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });

    it("should set the values on initialize", function(){
      var m = new this.TestModel({
        attribute1: {
          foo: "bar"
        },
        attribute2: [
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          }
        ]
      });
      expect(m.attribute1.get('foo')).toEqual('bar');
      expect(m.attribute2.length).toEqual(2);
      m.dispose();
    });
  });

  describe("parse()", function(){
    beforeEach(function(){
      this.TestModel = App.Models.BaseModel.extend({
        url: '/example',
        childs: [
          {
            attribute: 'attribute1',
            type     : 'model',
            name     : 'BaseModel'    
          },
          {
            attribute: 'attribute2',
            type     : 'collection',
            name     : 'BaseCollection'    
          }
        ],
      });
      var MOCK_GET_DATA = {
        attribute1: {
          foo: "bar"
        },
        attribute2: [
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          }
        ]
      };
      this.test = new this.TestModel();
      spyOn($, 'ajax').and.callFake(function(options){
        options.success(MOCK_GET_DATA);
      });
    });

    it("should fill the child data if defined on the response", function(){
      expect(this.test.attribute1.get('foo')).toEqual(undefined);
      expect(this.test.attribute2.length).toEqual(0);
      this.test.fetch();
      expect(this.test.attribute1.get('foo')).toEqual('bar');
      expect(this.test.attribute2.length).toEqual(2);
    });
  });
});
