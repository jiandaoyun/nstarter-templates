#!groovy

def execNode = ""
def registry = ""
def registryCredential = ""

pipeline {
    agent {
        node { label execNode }
    }

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '3'))
    }

    environment {
        REGISTRY = "${registry}"
        DOCKER_BUILDKIT = "1"
    }

    stages {
        stage('Build') {
            steps {
                sh(
                    script: 'make docker-compile',
                    label: 'prepare'
                )
            }
        }
        stage('Test') {
            when {
                not {
                    anyOf {
                        branch 'master'
                        branch 'PR-*'
                    }
                }
            }
            steps {
                sh(
                    script: 'make docker-test',
                    label: 'test'
                )
                publishHTML target: [
                    reportName: '单元测试覆盖率报告',
                    reportDir: 'report',
                    reportFiles: 'coverage/lcov-report/index.html',
                    reportTitles: '覆盖率',
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: false
                ]
                publishHTML target: [
                    reportName: '代码质量报告',
                    reportDir: 'report',
                    reportFiles: 'lint/eslint.html',
                    reportTitles: '代码质量',
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: false
                ]
            }
        }
        stage ('Release') {
            when {
                anyOf {
                    branch 'dev'
                    branch 'master'
                }
            }
            steps {
                sh(
                    script: "make docker-build BRANCH=${BRANCH_NAME}",
                    label: "build image"
                )
                withDockerRegistry(credentialsId: registryCredential, url: "https://${env.REGISTRY}") {
                    sh(
                        script: "make docker-push BRANCH=${BRANCH_NAME} DOCKER_REGISTRY=${REGISTRY}",
                        label: "push image"
                    )
                }
            }
        }
    }
    post {
        always {
            sh(script: 'make clean')
        }
    }
}