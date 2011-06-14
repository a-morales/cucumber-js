require('../../../support/spec_helper');

describe("Cucumber.Ast.TreeWalker.Event", function() {
  var Cucumber = require('cucumber');
  var event, name, payload;

  beforeEach(function() {
    name    = "SomeEvent";
    payloadItems = [
      createSpy("First payload item"),
      createSpy("Second payload item"),
      createSpy("Third payload item")
    ];
    payload = {
      firstItem:  payloadItems[0],
      secondItem: payloadItems[1],
      thirdItem:  payloadItems[2]
    };
    event   = Cucumber.Ast.TreeWalker.Event(name, payload);
  });

  describe("getName()", function() {
    it("returns the name of the event", function() {
      expect(event.getName()).toBe(name);
    });
  });

  describe("replicateAsPreEvent()", function() {
    var preEvent;

    beforeEach(function() {
      preEvent = createSpy("Pre-event (before)");
      spyOn(Cucumber.Ast.TreeWalker, 'Event').andReturn(preEvent);
    });

    it("creates a new event with the before prefix prepended to the event name and the same payload", function() {
      var newName = Cucumber.Ast.TreeWalker.BEFORE_EVENT_NAME_PREFIX + name;
      event.replicateAsPreEvent();
      expect(Cucumber.Ast.TreeWalker.Event).toHaveBeenCalledWith(newName, payload);
    });

    it("returns the new event", function() {
      expect(event.replicateAsPreEvent()).toBe(preEvent);
    });
  });

  describe("replicateAsPostEvent()", function() {
    var postEvent;

    beforeEach(function() {
      postEvent = createSpy("Post-event (after)");
      spyOn(Cucumber.Ast.TreeWalker, 'Event').andReturn(postEvent);
    });

    it("creates a new event with the after prefix prepended to the event name and the same payload", function() {
      var newName = Cucumber.Ast.TreeWalker.AFTER_EVENT_NAME_PREFIX + name;
      event.replicateAsPostEvent();
      expect(Cucumber.Ast.TreeWalker.Event).toHaveBeenCalledWith(newName, payload);
    });

    it("returns the new event", function() {
      expect(event.replicateAsPostEvent()).toBe(postEvent);
    });
  });

  describe("getPayloadItem()", function() {
    it("returns the requested item from the payload", function() {
      expect(event.getPayloadItem('firstItem')).toBe(payloadItems[0]);
      expect(event.getPayloadItem('secondItem')).toBe(payloadItems[1]);
      expect(event.getPayloadItem('thirdItem')).toBe(payloadItems[2]);
    });

    it("returns undefined when the item does not exist in the payload", function() {
      expect(event.getPayloadItem('unknownItem')).toBeUndefined();
    });
  });
});