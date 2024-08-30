docker-build:
	docker buildx build --target=artifacts \
		--progress=plain \
		--file ci/Dockerfile \
		-o dist\
		.

deploy:
	fun install
	fun build
	fun deploy -y

.PHONY: deploy
