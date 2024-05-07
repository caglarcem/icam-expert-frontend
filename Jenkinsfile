pipeline {
    agent any
    environment {
				NODEJS_VERSION = 'NodeJs 22.1.0' 
        DOCKER_COMPOSE_VERSION = '2.27.0'
        DOCKER_IMAGE_NAME = 'caglarcem/icam-frontend'
        DOCKER_IMAGE_TAG = 'latest'
    }
		tools {
        nodejs "${NODEJS_VERSION}"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/caglarcem/icam-expert-frontend.git'
            }
        }
        stage('Build and Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
                sh 'npm run build'
            }
        }
				stage('Docker build') {
					def dockerHome = tool 'MyDocker'
        	env.PATH = "${dockerHome}/bin:${env.PATH}"
					
					sh 'docker build -t $DOCKER_IMAGE_NAME .'
				}
        stage('Tag Docker Image') {
            steps {
                sh 'docker tag $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG'
            }
        }
        stage('Push to DockerHub') {
            steps {
                sh 'docker login -u caglarcem -p 980Cc1495'
                sh 'docker push $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG'
            }
        }
    }
    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}