pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        IMAGE_NAME = 'saad-hassan-portfolio'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                sh 'python3 -m venv .ci-venv && .ci-venv/bin/pip install -r requirements.txt && .ci-venv/bin/python -m unittest discover -s tests -v'
            }
        }

        stage('SonarQube analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    sh 'curl --retry 30 --retry-connrefused --retry-delay 2 --retry-max-time 60 --fail http://sonarqube:9000/api/system/status'
                    sh 'sonar-scanner -Dsonar.host.url=http://sonarqube:9000'
                }
            }
        }

        stage('Build Docker image') {
            steps {
                sh 'docker build --file Dockerfile --tag "$IMAGE_NAME:$BUILD_NUMBER" --tag "$IMAGE_NAME:latest" .'
            }
        }
    }
}