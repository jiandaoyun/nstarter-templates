docker-build:
	docker buildx build --target=compile \
		--progress=plain \
		--file ci/Dockerfile \
		.

docker-test:
	docker buildx build --target=test-report \
		--progress=plain \
		--file ci/Dockerfile \
		-o report \
		.

docker-release:
	docker buildx build --target=release \
		--progress=plain \
		--file ci/Dockerfile \
		.

clean:
	rm -rf report/

.PHONY: clean
