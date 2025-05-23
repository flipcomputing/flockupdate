export function runTests(flock, expect) {
  describe("Flock API Tests", function () {
	it("should set the sky color", function (done) {
	  flock.setSky("#6495ed");
	  done();
	});

	it("should create a box and check its position", function (done) {
	  const box1 = flock.createBox("box__1", {
		color: "#996633",
		width: 4,
		height: 0.5,
		depth: 4,
		position: [-4, 0.5, 0],
	  });

	  const mesh1 = flock.scene.getMeshByName(box1);

	  expect(mesh1.position.x).to.equal(-4);
	  expect(mesh1.position.y).to.equal(0.75);
	  expect(mesh1.position.z).to.equal(0);
	  done();
	});

	it("should check if the box is created with the right size", function (done) {
	  const box1 = flock.createBox("box__1", {
		color: "#996633",
		width: 4,
		height: 0.5,
		depth: 4,
		position: [-4, 0.5, 0],
	  });

	  const mesh1 = flock.scene.getMeshByName(box1);
	  const boundingBox = mesh1.getBoundingInfo().boundingBox;

	  expect(boundingBox.maximum.x - boundingBox.minimum.x).to.equal(4);     // width
	  expect(boundingBox.maximum.y - boundingBox.minimum.y).to.equal(0.5);   // height
	  expect(boundingBox.maximum.z - boundingBox.minimum.z).to.equal(4);     // depth
	  done();
	});

	// Add more test cases as needed
  });
}
