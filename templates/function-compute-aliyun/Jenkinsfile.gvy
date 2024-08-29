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
        NODE_VERSION = 'v12.16.2'
        NODE_MIRROR = 'https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/'
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
                nvm(
                    version: env.NODE_VERSION,
                    nvmNodeJsOrgMirror: env.NODE_MIRROR
                ) {
                    sh(script: 'npm install', label: 'install')
                    sh(script: 'fun --version', label: 'funcraft')
                }
            }
        }
        stage ('Release') {
            steps {
                nvm(
                    version: env.NODE_VERSION,
                    nvmNodeJsOrgMirror: env.NODE_MIRROR
                ) {
                    sh(script: 'npm run build', label: 'build')
                    sh(script: 'fun install')
                    sh(script: 'fun build')
                }
            }
        }
        stage('Deploy') {
            steps {
                sh(script: 'fun deploy -y')
            }
        }
    }
}
