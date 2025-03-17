pipeline {
  agent {
    docker {            
        image 'node:20.2.0-alpine3.17'
        args '-p 3000:3000' 
    }
  }

  environment {
    DOCKER_IMAGE = "empreitaehfront"
    DOCKER_TAG = "latest"
  }

  stages {
    stage('Build') {
      steps {
        echo "Build da aplicação"
        sh 'npm install' 
        sh 'CI=false npm run build'
      }
    }

    stage('Test') {
      steps {
        echo "Test da aplicação"
        sh "npm test"
      }
    }

    stage('Deploy') {
      steps {
        echo "Deploy da aplicação"
        
        sh 'docker stop ${DOCKER_IMAGE} || true'
        sh 'docker rm ${DOCKER_IMAGE} || true'

        
        sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'

        sh 'docker run -d --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}'
      }
    }
  }
}
