describe("App", function() {
  describe("isObjectsArray", function(){
    beforeEach(function(){
      this.error1  = "test";
      this.error2  = ["test", "test"];
      this.error3  = [ {}, "test", "test" ];
      this.success = [{}, {}, {}];
    });

    it("should return false if the value is not an object's array", function(){
      expect(App.isObjectsArray(this.error1)).toBe(false);
      expect(App.isObjectsArray(this.error2)).toBe(false);
      expect(App.isObjectsArray(this.error3)).toBe(false);
    });

    it("should return true if the value is an object's array", function(){
      expect(App.isObjectsArray(this.success)).toBe(true);
    });
  });
});
