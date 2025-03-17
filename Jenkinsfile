pipeline {
  agent any // Executa no próprio host do Jenkins

  environment {
    DOCKER_IMAGE = "empreitaehfront-app"
    DOCKER_TAG = "latest"
  }

  stages {
    stage('Build') {
      agent {
        docker {            
          image 'node:20.2.0-alpine3.17' // Usa Node apenas para build
        }
      }
      steps {
        echo "Build da aplicação"
        sh 'npm install' 
        sh 'CI=false npm run build'
      }
    }

    stage('Test') {
      steps {
        echo "Test da aplicação"
      }
    }

    stage('Deploy') {
      steps {
        echo "Deploy da aplicação"

        sh '''
          if [ "$(docker ps -q -f name=${DOCKER_IMAGE})" ]; then
            docker stop ${DOCKER_IMAGE}
            docker rm ${DOCKER_IMAGE}
          fi
        '''

        sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'
        sh 'docker run -d --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}'
      }
    }
  }
}
