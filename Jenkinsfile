pipeline{
    agent {  label 'AGENT-1' }
    options {
        disableConcurrentBuilds()
        timeout(time: 25, unit: 'MINUTES')
        timestamps()
    }
    environment{
        APPNAME = 'demo-app'
        REGION = 'us-east-1'
        ACC_ID = '816600798829'
        REPO_NAME = 'ganesh/docker'
    }
    stages{
        stage('Read Version') {
            steps {
                script {
                    def pkg = readJSON file: 'package.json'
                    env.APP_VERSION = pkg.version
                    echo "version: ${APP_VERSION}"
                }
            }
        }

        stage('Installing dependencies'){
            steps {
                sh """
                    npm install
                """
            }
        }
        stage('Unit test'){
            steps {
                sh """
                    npm test
                """
            }
        }
        stage('SonarQube Scan') {
            environment {
                scannerHome = tool 'Sonar-8.0'
            }
            steps {
                withSonarQubeEnv('sonar-scan') {
                    sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }

        
        // stage('sonar scanning'){
        //  steps {
        //       withSonarQubeEnv('sonar-scan') {
        //         sh 'sonar-scanner'
        //       }
        //     }
        // }
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Image Building'){
            steps {
                script{
                sh """
                    docker build -t ${APPNAME}:${APP_VERSION} .
                    docker images 
                """
                }
            }
        }
        // stage('ECR Pushing'){
        //     steps {
        //         withAWS(credentials: 'aws-creds', region: "${REGION}") {
        //         sh """
        //             aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin 816600798829.dkr.ecr.us-east-1.amazonaws.com

        //             docker tag ${APPNAME}:${APP_VERSION} ${ACC_ID}.dkr.ecr.${REGION}.amazonaws.com/${APPNAME}:${APP_VERSION}
        //             docker push ${ACC_ID}.dkr.ecr.us-east-1.amazonaws.com/${REPO_NAME}:${APP_VERSION}
        //         """
        //         }
        //     }
        // }
      stage('ECR Pushing') {
    steps {
        withAWS(credentials: 'aws-creds', region: "${REGION}") {
            sh """
                aws ecr get-login-password --region ${REGION} | \
                  docker login --username AWS --password-stdin ${ACC_ID}.dkr.ecr.${REGION}.amazonaws.com

                docker tag ${APPNAME}:${APP_VERSION} ${ACC_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:${APP_VERSION}
                docker push ${ACC_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:${APP_VERSION}
            """
        }
    }
}

    }
    post {
        always {
            echo "Build finished"
        }
        cleanup {
            cleanWs()
        }
    }
} 