VERSION = $(shell cat VERSION)

BRANCH ?= dev
BRANCH_LABEL = $(subst /,_,${BRANCH})
IMAGE_NAME = app

# 镜像标签
ifeq ($(shell echo ${BRANCH} | head -c 6),master)
	# 生产环境
	DOCKER_IMG = ${IMAGE_NAME}:${VERSION}
else
	# 测试环境按分支命名镜像
	DOCKER_IMG = ${IMAGE_NAME}:${BRANCH_LABEL}
endif

docker-compile:
	docker build --target compile .

docker-test:
	docker buildx build --target=test-report \
		--progress=plain \
		--file ci/Dockerfile \
		-o report \
		./

docker-build:
	docker buildx build --target=runtime \
		--progress=plain \
		--file ci/Dockerfile \
		-t ${DOCKER_IMG} \
		./

docker-push:
	docker tag ${DOCKER_IMG} ${DOCKER_REGISTRY}/${DOCKER_IMG}
	docker push ${DOCKER_REGISTRY}/${DOCKER_IMG} > digest.txt
	$(if $(filter $(shell echo ${BRANCH} | head -c 6),master), \
		docker tag ${DOCKER_IMG} ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest && \
		docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest > digest.txt \
	)

clean:
	rm -rf report/ digest.txt

.PHONY: clean
