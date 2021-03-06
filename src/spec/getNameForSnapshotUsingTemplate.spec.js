import buildGetNameForSnapshotUsingTemplate from "../buildGetNameForSnapshotUsingTemplate";

describe("getNameForSnapshotUsingTemplate", function() {
  let snapshotNameRegistry;
  let snapshotFilename;
  let snapshotNameTemplate;
  beforeEach(function() {
    snapshotNameRegistry = {};
    snapshotFilename = "filename";
    snapshotNameTemplate = "name";
  });

  const getNameForSnapshotUsingTemplate = (...args) => buildGetNameForSnapshotUsingTemplate(snapshotNameRegistry)(...args);
  const expectRegistryCounter = (number) => expect(snapshotNameRegistry[snapshotFilename][snapshotNameTemplate]).to.equal(number);

  describe("when the snapshot name registry is empty", function() {
    it("appends a 1 to the name template", function() {
      const result = getNameForSnapshotUsingTemplate(snapshotFilename, snapshotNameTemplate);
      expect(result).to.equal("name 1");
    });

    it("updates the registry", function() {
      getNameForSnapshotUsingTemplate(snapshotFilename, snapshotNameTemplate);
      expectRegistryCounter(1);
    });
  });

  describe("when the snapshot name registry has unrelated data", function() {
    beforeEach(function() {
      snapshotNameRegistry = {
        someOtherFilename: {
          someOtherName: 2,
        },
      };
    });

    it("appends a 1 to the name template", function() {
      const result = getNameForSnapshotUsingTemplate(snapshotFilename, snapshotNameTemplate);
      expect(result).to.equal("name 1");
    });

    it("updates the registry", function() {
      getNameForSnapshotUsingTemplate(snapshotFilename, snapshotNameTemplate);
      expectRegistryCounter(1);
    });
  });

  describe("when the snapshot name registry has another file with the same snapshot name", function() {
    beforeEach(function() {
      snapshotNameRegistry = {
        someOtherFilename: {
          name: 2,
        },
      };
    });

    it("ignores it and (still) appends 1 to the name", function() {
      const result = getNameForSnapshotUsingTemplate(snapshotFilename, snapshotNameTemplate);
      expect(result).to.equal("name 1");
    });
  });

  describe("when the snapshot name registry has data for the name already", function() {
    beforeEach(function() {
      snapshotNameRegistry = {
        [snapshotFilename]: {
          [snapshotNameTemplate]: 3,
        },
      };
    });

    it("adds 1 to the value and returns a new name using the new value", function() {
      const result = getNameForSnapshotUsingTemplate(snapshotFilename, snapshotNameTemplate);
      expect(result).to.equal("name 4");
      expectRegistryCounter(4);
    });
  });
});