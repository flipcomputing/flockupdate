// test-glideTo.js

import { expect } from "chai";

function checkXPosition(box, pos) {
	return Math.abs(box.position.x - pos) <= 0.1
}

// Test suite for glideTo function
export function runGlideToTests(flock) {
	describe("glideTo function tests", function () {
		let box1;

		// Set up the box before each test
		beforeEach(async function () {
			// Create a box before each test
			box1 = flock.createBox("box1", {
			  color: "#996633",
			  width: 1,
			  height: 1,
			  depth: 1,
			  position: [0, 0, 0],
			});
		});

		// Clean up after each test
		afterEach(function () {
			// Dispose of the box after each test to avoid memory leaks and ensure clean state
			flock.dispose(box1);
		});

		it("should move the box to the correct position", function (done) {
			this.timeout(15000); // Increase the timeout forthis test
			// Call glideTo to move the

			flock.glideTo(box1, 6, 0, 0, 500).then(() => {
				const box = flock.scene.getMeshByName(box1);

				// Assert the box has moved to the correct position
				expect(box.position.x).to.equal(6);
				expect(box.position.y).to.equal(0.5);
				expect(box.position.z).to.equal(0);
				done();
			});
		});

		it("should handle reverse movement", function (done) {
			this.timeout(10000); // Increase the timeout for this test

			// Move the box with loop enabled
			flock.glideTo(box1, 6, 0, 0, 2000, true); // Start the glide with return enabled

			let count = 0;
			let passed = true

			// Check the box's position periodically
			const intervalId = setInterval(() => {
				const box = flock.scene.getMeshByName(box1);

				switch (count) {
					case 3:
						if (!checkXPosition(box, 0)) {
							passed = false;
						}
					  break;
					case 0:
					case 2:
						if (!checkXPosition(box, 3)) {
							passed = false;
						} 
						break;
					case 1:
						if (!checkXPosition(box, 6)) {
							passed = false;
						}
						break;
				}

				count++;
				
				// Stop checking after 4 seconds
				if (count > 3) {
					clearInterval(intervalId);

					expect(passed).to.be.true;
					done();
				}
			}, 1000); // Check every 1000ms
		});

		it("should handle looping", function (done) {
			this.timeout(10000); // Increase the timeout for this test

			// Define the start time
			const startTime = Date.now();

			// Move the box with loop enabled
			flock.glideTo(box1, 6, 0, 0, 1000, false, true); // Start the glide with looping enabled

			// Track whether the box has reached the target position
			let passed = true;

			let count = 0

			const intervalId = setInterval(() => {
				const box = flock.scene.getMeshByName(box1);
				if (!checkXPosition(box, 0)) passed = false;
				console.log("Loop", count, box.position.x)
				count++;

				if (count > 8) {
					clearInterval(intervalId);

					expect(passed).to.be.true;
					done();
				}
			}, 1000);
			});

		it("should follow the correct easing function", function (done) {
			this.timeout(5000); // Increase the timeout for this test
			// Test with different easing options (Linear by default)
		
			flock
				.glideTo(box1, 6, 0, 0, 1000, false, false, "SineEase")
				.then(() => {
					const box = flock.scene.getMeshByName(box1);

					// Check if the position matches expected easing behavior
					expect(box.position.x).to.be.closeTo(6, 0.1); // Within some tolerance
					expect(box.position.y).to.be.closeTo(0.5, 0.1);
					expect(box.position.z).to.be.closeTo(0, 0.1);
					done();
				});
		});

		it("should complete within the given duration", function (done) {
			this.timeout(10000); // Increase the timeout for this test
			const startTime = Date.now();

			flock.glideTo(box1,  6, 0, 0, 2000).then(() => {
				const endTime = Date.now();
				const duration = (endTime - startTime) / 1000; // Convert to seconds

				// Assert the movement took approximately the specified duration
				expect(duration).to.be.closeTo(2, 0.5); // Within 0.5 seconds tolerance
				done();
			});
		});
	});
}
