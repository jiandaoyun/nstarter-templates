#!groovy
pipeline {
    agent {
        node { label 'aliyun' }
    }

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '3'))
    }

    environment {
        DOCKER_BUILDKIT = "1"
        REGION = 'cn-hangzhou'
        TIMEOUT = '10'
        RETRIES = '3'
        ACCOUNT_ID=credentials('aliyun-account-id')
        ACCESS_KEY_ID=credentials('aliyun-fc-ak')
        ACCESS_KEY_SECRET=credentials('aliyun-fc-aks')
    }
    stages {
        stage('Prepare') {
            steps {
                sh(script: 'fun --version', label: 'funcraft')
            }
        }
        stage ('Release') {
            steps {
                sh(script: "make docker-build", label: 'build')
                sh(script: 'fun install')
                sh(script: 'fun build')
            }
        }
        stage('Deploy') {
            steps {
                sh(script: 'fun deploy -y')
            }
        }
    }
}
